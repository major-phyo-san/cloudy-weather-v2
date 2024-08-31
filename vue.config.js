const { defineConfig } = require('@vue/cli-service')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true
});

// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new HtmlWebpackPlugin({
//         title: 'My Weather App', // Set the title
//         // template: 'public/index.html', // Specify the template file
//         inject: true,
//         // Add any other options you need
//       })
//     ]
//   }
// };

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Cloudy Weather'; // Set the title
      // Add any other options you need
      return args;
    });
  }
};
