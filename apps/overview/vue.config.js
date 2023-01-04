const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin')

const isProd = ['production', 'prod'].includes(process.env.NODE_ENV)

const rootPackage = require('../../package.json')
const appPackage = require('./package.json')
const appName = appPackage.name

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = defineConfig({
  publicPath: isProd ? `/${appName}` : 'auto',
  productionSourceMap: true,
  pages: {
    overview: {
      filename: 'index.html',
      template: 'src/index.html',
      entry: ['src/index.ts']
    }
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 1002,
    https: {
      key: fs.readFileSync(resolve('../../certificate/cert.key')),
      cert: fs.readFileSync(resolve('../../certificate/cert.crt')),
    },
  },
  configureWebpack: config => {

    config.resolve.extensions = ['.jsx', '.js', '.ts', '.tsx', '.vue']
    config.optimization = {
      splitChunks: false,
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('src', resolve('src'))

    const shared = {}
    const sharedDependency = ['vue', 'vue-router', 'vuex']
    sharedDependency.forEach((item) => {
      shared[item] = {
        singleton: true,
        requiredVersion: rootPackage.dependencies[item]
      }
    })
    config.plugin('ModuleFederationPlugin')
      .use(ModuleFederationPlugin, [
        {
          name: appName, // 该名称必须与入口名称相匹配
          filename: 'remoteEntry.js',
          remotes: {
            portal: `portal@${isProd ? '' : 'https://localhost'}/remoteEntry.js`
          },
          exposes: {
            './exports': './src/exports.ts'
          }
        }
      ])

    config.plugin('ExternalTemplateRemotesPlugin')
      .use(ExternalTemplateRemotesPlugin)

    config.plugin('eslint')
      .use(ESLintPlugin, [
        {
          fix: true,
          extensions: ['.jsx', '.js', '.vue', '.ts', '.tsx'],
          threads: true,
          lintDirtyModulesOnly: true
        }
      ])
 
    config.output
      .set('uniqueName', appName)
      .filename('js/[name].[contenthash:8].js')
      .chunkFilename('js/[name].[contenthash:8].js')
  }
})
