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
  transpileDependencies: true,
  publicPath: isProd ? '/home' : 'auto',
  pages: {
    index: {
      template: './src/index.html',
      entry: ['./src/index.ts']
    }
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 10000,
    https: {
      key: fs.readFileSync(resolve('../../certificate/cert.key')),
      cert: fs.readFileSync(resolve('../../certificate/cert.crt')),
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  configureWebpack: config => {
    if (!isProd) {
      config.plugins.push(new ESLintPlugin({
        fix: true,
        extensions: ['.jsx', '.js', '.vue', '.ts', '.tsx'],
        threads: true,
        lintDirtyModulesOnly: true
      }));
    }

    config.resolve.extensions = ['.jsx', '.js', '.ts', '.tsx', '.vue']
  },
  chainWebpack: config => {

    const shared = {}
    ;['vue', 'vue-router', 'vuex'].map((item) => {
      shared[item] = {
        singleton: true,
        requiredVersion: rootPackage.dependencies[item]
      }
    })
    config.plugin('ModuleFederationPlugin')
      .use(ModuleFederationPlugin, [
        {
          name: appName,
          filename: 'remoteEntry.js',
          remotes: {
            portal: `portal@${isProd ? '' : 'https://localhost'}/remoteEntry.js`
          },
          exposes: {
            './exports': './src/exports.ts'
          },
          shared
        }
      ])

    config.plugin('ExternalTemplateRemotesPlugin')
      .use(ExternalTemplateRemotesPlugin)

    config.output.set('uniqueName', appName)
    config.output
      .filename('js/[name].[contenthash:8].js')
      .chunkFilename('js/[name].[contenthash:8].js')
  }
})
