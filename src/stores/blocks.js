import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { deepObjectToArray, uuid } from '@/lib/utils'
import * as esprima from 'esprima'

export const useBlockStore = defineStore(
  'js-notebook-blocks',
  () => {
    const blockTypes = [
      { name: 'Code', value: 'code' },
      { name: 'Text', value: 'text' }
    ]

    // ---------- SHEETS ----------

    const sheets = ref([
      { id: uuid(), name: 'New Sheet', blocks: [], env: null, entityType: null, entityId: null }
    ])
    const selectedSheetIndex = ref(0)
    const selectedSheet = computed(() => sheets.value[selectedSheetIndex.value])

    const addSheet = () => {
      sheets.value.push({
        id: uuid(),
        name: 'Sheet',
        blocks: [],
        env: null,
        entityType: null,
        entityId: null
      })
    }

    const removeSheet = (index) => {
      if (sheets.value.length == 1) return
      if (selectedSheetIndex.value == index) {
        selectedSheetIndex.value = index - 1
      }
      sheets.value.splice(index, 1)
    }

    // ---------- BLOCKS ----------

    const blocks = computed(() => {
      return selectedSheet.value.blocks
    })

    const addBlock = (kind) => {
      switch (kind) {
        case 'text':
          blocks.value.push({ id: uuid(), kind: 'text', text: '' })
          return
        case 'code':
          blocks.value.push({
            id: uuid(),
            kind: 'code',
            code: '',
            prevCode: null,
            result: undefined,
            error: null
          })
          return
      }
    }

    const removeBlock = (index) => {
      blocks.value.splice(index, 1)
    }

    // ---------- EXECUTION ----------

    const getContext = (index) => {
      return blocks.value.slice(0, index).reduce((acc, block) => {
        if (!block.result || typeof block.result !== 'object') return acc
        return { ...acc, ...(block.result || {}) }
      }, {})
    }

    const isBlockDependentOnContext = (code, context) => {
      const contextKeys = Object.keys(context)
      const ast = esprima.parseScript(code)
      let isDependent = false
      // Function to traverse the AST
      const traverse = (node) => {
        if (isDependent) return
        if (node.type === 'Identifier' && contextKeys.includes(node.name)) {
          isDependent = true
          return
        }
        for (const key in node) {
          if (Object.prototype.hasOwnProperty.call(node, key)) {
            const child = node[key]
            if (typeof child === 'object' && child !== null) {
              traverse(child)
            }
          }
        }
      }
      traverse(ast)
      return isDependent
    }

    const codeHasResultDefined = (code) => {
      const ast = esprima.parseScript(code)
      let hasResult = false
      for (const node of ast.body) {
        if (node.type === 'VariableDeclaration') {
          for (const declarator of node.declarations) {
            if (declarator.id && declarator.id.name === 'result') {
              hasResult = true
              break
            }
          }
        }
        if (hasResult) break
      }
      return hasResult
    }

    const codeEndsWithResult = (code) => {
      const lastLine = code.trim().split('\n').pop()
      return lastLine.trim().startsWith('result')
    }

    const executeAll = () => {
      execute(0, true)
    }

    const execute = async (index, force) => {
      const sl = blocks.value.slice(index, blocks.value.length)
      // call executeBlock for each block in the slice
      // calls have to be sequential
      let forceRun = true
      for (let i = 0; i < sl.length; i++) {
        const block = sl[i]
        if (block.kind != 'code') continue
        const context = getContext(index + i)
        const isBlockDependent = isBlockDependentOnContext(block.code, context)
        if (force || forceRun || isBlockDependent) await executeBlock(index + i)
        forceRun = false
      }
    }

    const constructValidVariableName = (name) => {
      return name
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .replace(/^[^a-zA-Z_]+/g, '')
        .replace(/_{2,}/g, '_')
    }

    const executeBlock = async (index) => {
      const block = blocks.value[index]
      if (!block || block.kind != 'code') return
      const code = block.code.trim()
      block.prevCode = code
      block.error = null
      block.result = undefined
      block.loading = true
      try {
        const context = getContext(index)
        const letDeclarations = Object.entries(context)
          .map(([key, value]) => {
            const name = constructValidVariableName(key)
            return `let ${name} = ${JSON.stringify(value)};`
          })
          .join('\n')
        const processed = processScript(code)
        const codeWithContext = letDeclarations + '\n' + processed
        const payload = {
          script: codeWithContext
        }
        const response = await validate(payload)
        if (response.error) throw new Error(response.error)
        const output = response.output
        if (typeof output !== 'object' || output === null)
          throw new Error('Output must be an object')
        block.result = deepObjectToArray(output)
        block.error = response.error
      } catch (e) {
        block.result = null
        block.error = e.message
      } finally {
        block.loading = false
      }
    }

    const validate = async (payload) => {
      // const response = await fetch('/api/validate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // })
      // return response.json()

      // arbitrary delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const result = new Function(payload.script + '; return result;')()
      return {
        output: result
      }
    }

    const processScript = (script) => {
      // Parse the script to an AST
      const ast = esprima.parseScript(script, { range: true })

      // Collect root-level variable names
      let rootVariables = []
      for (const node of ast.body) {
        if (node.type === 'VariableDeclaration' && node.declarations) {
          for (const declaration of node.declarations) {
            // Check if the declaration is not a function
            if (
              declaration.id &&
              declaration.id.name &&
              declaration.init &&
              declaration.init.type !== 'FunctionExpression'
            ) {
              rootVariables.push(declaration.id.name)
            }
          }
        }
      }

      // Construct the result object assignment
      const resultObject = `{ ${rootVariables.join(', ')} }`
      if (!codeHasResultDefined(script)) {
        script = `${script}\nconst result = ${resultObject};`
      }
      if (!codeEndsWithResult(script)) {
        script = `${script}\nresult;`
      }
      return script
    }

    return {
      blockTypes,
      sheets,
      selectedSheetIndex,
      selectedSheet,
      addSheet,
      removeSheet,
      blocks,
      addBlock,
      removeBlock,
      execute,
      executeAll
    }
  },
  {
    persist: {
      paths: ['sheets', 'selectedSheetIndex']
    }
  }
)
