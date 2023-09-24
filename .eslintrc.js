module.exports = {
  root: true,
  env: {
    node: true,
    es2023: true,
  },
  ignorePatterns: ['.eslintrc.cjs', '*.d.ts', '**/node_modules/*', 'lib/*'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // plugins: ['@typescript-eslint/eslint-plugin'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: 'off',
    quotes: 'off',
    'array-bracket-spacing': 'error',
    'comma-spacing': ['error', { after: true }], // 콤마 뒤에 공백 필수
    'no-constructor-return': 'error',
    'no-var': 'error', // var 키워드 사용 금지
    'no-duplicate-imports': 'error',
    'no-unused-private-class-members': 'error',
    'no-use-before-define': 'error', // 변수가 정의되기 전에는 변수 사용을 허용하지 않습니다.
    // 변수명 지정 방식을 Camelcase로 사용합니다. 상수변수(모두 대문자)는 경고가 발생하지 않습니다.
    camelcase: [
      'error',
      {
        ignoreImports: true,
        ignoreGlobals: true,
        ignoreDestructuring: false, // 구조 분해 패턴 내부의 식별자에만 적용
      },
    ],
    'class-methods-use-this': [
      'error',
      {
        enforceForClassFields: true, // 클래스 필드에서도 this를 사용해야 한다는 것을 강제합니다.
        // exceptMethods: [] //  this를 사용하지 않아도 될 메서드의 이름을 지정할 수 있습니다.
      },
    ],
    'default-case': 'error', // 모든 switch문에 default 명시합니다. `// no default` 주석을 작성하면 의도적으로 default를 생략할 수 있습니다.
    'dot-notation': 'error', // 객체의 속성 접근시 점 표기법을 사용합니다.
    eqeqeq: ['error', 'always'], // type-safe equality operators(===, !==)를 사용합니다.
    'no-console': 'warn',
    'no-eval': 'error', // eval() 사용 금지
    'no-lonely-if': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignoreArrayIndexes: true,
        ignoreClassFieldInitialValues: true, // 클래스 필드의 초기 값으로 사용되는 숫자가 괜찮은 것으로 간주되는지 지정
        enforceConst: true, // 숫자의 변수 선언에서 const 키워드를 확인해야 하는지 여부를 지정
        detectObjects: false, // 객체 속성을 설정할 때 숫자를 감지해야 하는지 여부를 지정
      },
    ],
    'no-multi-assign': 'error', // 단일 키워드 내에서 다중 변수 할당 금지
    'no-new-func': 'error', // new function 금지
    'no-param-reassign': 'error', // 함수 매개변수 재할당 금지
    'no-proto': 'error', // __proto__사용 금지
    'no-restricted-syntax': [
      'error',
      // 'FunctionExpression',
      'WithStatement',
      'BinaryExpression[operator="in"]',
    ],
    'prefer-arrow-callback': 'error', // callback 함수에 화살표 함수 사용 강제
    'no-undef': 'off',
  },
}
