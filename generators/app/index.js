const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')
const fs = require('fs')

const DEPENDENCIES = [
  'axios',
  'babel-helper-vue-jsx-merge-props',
  'babel-loader',
  'babel-plugin-syntax-jsx',
  'babel-plugin-transform-runtime',
  'babel-plugin-transform-vue-jsx',
  'babel-preset-env',
  'babel-preset-es2015',
  'babel-preset-stage-2',
  'babel-register',
  'clean-webpack-plugin',
  'cli-color',
  'eslint',
  'eslint-plugin-react',
  'extract-text-webpack-plugin',
  'file-saver',
  'friendly-errors-webpack-plugin',
  'iview',
  'lodash',
  'node-sass',
  'ora',
  'script-loader',
  'vue',
  'vue-router',
  'vue-template-compiler',
  'webpack',
  'webpack-cli',
  'xlsx'
]

const DEV_DEPENDENCIES = [
  'babel-polyfill',
  'clipboard',
  'copy-webpack-plugin',
  'core-js',
  'css-loader',
  'echarts',
  'file-loader',
  'gulp',
  'gulp-autoprefixer',
  'gulp-clean-css',
  'gulp-rename',
  'gulp-sass',
  'gulp-scss',
  'highlightjs',
  'html-webpack-plugin',
  'less',
  'less-loader',
  'localforage',
  'moment',
  'popper.js',
  'portfinder',
  'qs',
  'sass-loader',
  'style-loader',
  'url-loader',
  'vue-loader',
  'vue-style-loader',
  'vuex',
  'webpack-dev-server',
  'webpack-merge'
]

module.exports = class extends Generator {
  // 获取当前项目状态，获取基本配置参数等
  initianlizing() {}

  // 向用户展示交互式问题收集关键参数
  prompting() {
    this.log(
      yosay(`Welcome to the ace ${chalk.red('generator-react-ac')} generator!`)
    )

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name?',
        validate: name => {
          if (!name) {
            return 'Project name cannot be empty'
          }

          if (!this.fs.exists(this.destinationPath(name))) {
            return true
          }

          if (fs.statSync(this.destinationPath(name)).isDirectory()) {
            return 'Project already exist'
          }

          return true
        }
      },
      {
        type: 'confirm',
        name: 'vscode',
        message: 'Use vscode preference?',
        default: true
      },
      {
        type: 'confirm',
        name: 'docker',
        message: 'Use docker for release?',
        default: true
      },
      {
        type: 'confirm',
        name: 'mobileOnly',
        message: 'Is mobile only application?',
        default: false
      },
      {
        type: 'list',
        name: 'npmOrYarn',
        message: 'Which tool would you use for dependencies?',
        choices: ['npm', 'yarn']
      },
      {
        type: 'list',
        name: 'registry',
        message: 'Which registry would you use?',
        choices: [
          'https://registry.npm.taobao.org',
          'https://registry.npmjs.org'
        ]
      }
    ]

    return this.prompt(prompts).then(answers => {
      this.answer = {
        answers
      }

      return this.answer
    })
  }

  // 保存配置相关信息且生成配置文件（名称多为'.'开头的配置文件,例如.editorconfig）
  configuring() {
    this.destinationRoot(
      path.join(this.destinationRoot(), this.answer.answers.name)
    )
  }

  // 未匹配任何生命周期方法的非私有方法均在此环节*自动*执行
  default() {}

  // 依据模板进行新项目结构的写操作
  writing() {
    const { answers } = this.answer
    this.fs.copy(this.templatePath('build'), this.destinationPath('build'))
    this.fs.copy(this.templatePath('config'), this.destinationPath('config'))
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'))
    this.fs.copy(this.templatePath('static'), this.destinationPath('static'))
    this.fs.copy(
      this.templatePath('template-file'),
      this.destinationPath('template-file')
    )

    if (answers.vscode) {
      this.fs.copy(this.templatePath('vscode'), this.destinationPath('.vscode'))
    }

    this.fs.copy(this.templatePath('babelrc'), this.destinationPath('.babelrc'))
    this.fs.copy(
      this.templatePath('demo.html'),
      this.destinationPath('demo.html')
    )
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    )
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    )
    this.fs.copyTpl(
      this.templatePath('package.json.vm'),
      this.destinationPath('package.json'),
      this.answer
    )
    this.fs.copyTpl(
      this.templatePath('project.config.json.vm'),
      this.destinationPath('project.config.json'),
      this.answer
    )
    this.fs.copy(
      this.templatePath('README.md.vm'),
      this.destinationPath('README.md')
    )
  }

  // 处理冲突(内部调用，一般不用处理）
  conflicts() {}

  // 使用指定的包管理工具进行依赖安装(支持npm,bower,yarn)
  install() {
    const { answers } = this.answer

    const depTool = answers.npmOrYarn === 'npm' ? 'npmInstall' : 'yarnInstall'

    this[depTool](DEPENDENCIES, {
      registry: answers.registry,
      save: true
    })
    this[depTool](DEV_DEPENDENCIES, {
      registry: answers.registry,
      'save-dev': true
    })
  }

  // 结束动作，例如清屏，输出结束信息，say GoodBye等等
  end() {
    const { answers } = this.answer

    if (answers.vscode) {
      this.log.info(
        'Make sure you have vscode extension https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode installed'
      )
    }

    this.log.ok(`Project ${answers.name} generated!!!`)
  }
}
