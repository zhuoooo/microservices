const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

const isProd = ['production', 'prod'].includes(process.env.NODE_ENV)

const appPackage = require('./package.json')
const appName = appPackage.name

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      template: './src/index.html',
      entry: ['./src/main.ts']
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

    config.resolve.extensions = ['.jsx', '.js', '.ts', '.tsx', '.vue'];
  },
  chainWebpack: config => {
    config.output.set('uniqueName', appName)
    
    config.output
      .filename(`static/js/${appName}.[name].[chunkhash:8].js`)
      .chunkFilename(`static/js/${appName}.[name].[chunkhash:8].js`)
  }
})
