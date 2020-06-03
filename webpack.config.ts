import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import AutoPrefixer from "autoprefixer";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const devMode = process.env.NODE_ENV === "development";

export default {
  entry: {
    main: path.join(__dirname, "src", "index.tsx")
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
    alias: {
      components: path.resolve(__dirname, "src/components/"),
      models: path.resolve(__dirname, "src/models/"),
      reduxFiles: path.resolve(__dirname, "src/data/redux/"),
      helpers: path.resolve(__dirname, "src/helpers")
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [AutoPrefixer()],
              sourceMap: true
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000"
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  node: {
    fs: "empty"
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    proxy: {
      "/logout": "http://localhost:3001",
      "/api": "http://localhost:3001"
    },
    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: "./public/index.html",
      filename: "index.html"
    }),
    new CopyPlugin([
      { from: "public/assets", to: "assets" },
      { from: "public/images", to: "images" },
      "public/assets/logo.svg",
      "public/manifest.json",
      "public/sw.js"
    ]),
    new CleanWebpackPlugin()
  ]
};
