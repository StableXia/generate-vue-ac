const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')
const fs = require('fs')

const DEPENDENCIES = [
  'axios',
  'vue',
  'vue-router',
  'iview',
  'vuex',
  'iview-extensions',
  'localforage'
]

const DEV_DEPENDENCIES = [
  'babel-helper-vue-jsx-merge-props',
  'babel-loader',
  'babel-plugin-syntax-jsx',
  'babel-plugin-transform-runtime',
  'babel-plugin-transform-vue-jsx',
  'babel-preset-env',
  'babel-preset-es2015',
  'babel-preset-stage-2',
  'babel-register',
  'cli-color',
  'ora',
  'eslint',
  'eslint-plugin-react',
  'husky',
  'lint-staged',
  'script-loader',
  'css-loader',
  'file-loader',
  'less',
  'less-loader',
  'node-sass',
  'sass-loader',
  'style-loader',
  'url-loader',
  'vue-loader',
  'vue-style-loader',
  'vue-template-compiler',
  'webpack-dev-server',
  'webpack',
  'webpack-cli',
  'webpack-merge',
  'copy-webpack-plugin',
  'html-webpack-plugin',
  'clean-webpack-plugin',
  'mini-css-extract-plugin',
  'friendly-errors-webpack-plugin',
  'portfinder'
]

module.exports = class extends Generator {
  initianlizing() {}

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

  configuring() {
    this.destinationRoot(
      path.join(this.destinationRoot(), this.answer.answers.name)
    )
  }

  default() {}

  writing() {
    const { answers } = this.answer

    this.fs.copy(this.templatePath('build'), this.destinationPath('build'))
    this.fs.copy(this.templatePath('config'), this.destinationPath('config'))
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'))
    this.fs.copy(this.templatePath('static'), this.destinationPath('static'))

    if (answers.vscode) {
      this.fs.copy(this.templatePath('vscode'), this.destinationPath('.vscode'))
    }

    this.fs.copy(this.templatePath('babelrc'), this.destinationPath('.babelrc'))
    this.fs.copy(
      this.templatePath('template.html'),
      this.destinationPath('demo.html')
    )
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc.js')
    )
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('template.html'),
      this.destinationPath('index.html')
    )
    this.fs.copyTpl(
      this.templatePath('package.json.vm'),
      this.destinationPath('package.json'),
      this.answer
    )
    this.fs.copy(
      this.templatePath('prettierrc'),
      this.destinationPath('.prettierrc')
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

  conflicts() {}

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
