import { defineConfig } from 'umi';

export default defineConfig({
  title: 'Metalents',
  favicon: '/favicon.ico',
  fastRefresh: {},
  antd: false,
  request: false,
  hash: true,
  define: {
    keywords:
      'Metalents,Bounce,NFT Design,NFT Development,Web3 Development,Defi Game',
    description:
      "💻Web 3.0's Marketplace for Freelance Work. 💰Become a Metalents & get paid in Crypto Today! ",
  },
  terserOptions: {
    compress: {
      drop_console: true,
    },
  },
  dva: {
    hmr: true,
    immer: true,
  },
  manifest: {
    writeToFileEmit: true,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  // dynamicImport: {},
  // chunks: ['vendors', 'umi'],
  // chainWebpack: function (config, { webpack }) {
  //   config.merge({
  //     optimization: {
  //       splitChunks: {
  //         chunks: 'all',
  //         minSize: 30000,
  //         minChunks: 3,
  //         automaticNameDelimiter: '.',
  //         cacheGroups: {
  //           vendor: {
  //             name: 'vendors',
  //             test({ resource }:any) {
  //               return /[\\/]node_modules[\\/]/.test(resource);
  //             },
  //             priority: 10,
  //           },
  //         },
  //       },
  //     },
  //   });
  // },
});
