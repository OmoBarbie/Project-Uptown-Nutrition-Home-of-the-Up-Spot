import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  nextjs: true,
}, {
  rules: {
    // Next.js apps use process.env everywhere — this is not a Node.js script
    'node/prefer-global/process': 'off',
    // Allow console.log in addition to warn/error in client code
    'no-console': 'off',
    // dangerouslySetInnerHTML is intentional for JSON-LD structured data
    'react-dom/no-dangerously-set-innerhtml': 'off',
  },
})
