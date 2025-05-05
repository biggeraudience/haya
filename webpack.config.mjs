import path from 'path';

export default {
  entry: './src/main.jsx', // Entry point for the JSX file
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Regex to match .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Use Babel presets for modern JavaScript and React
          },
        },
      },
      {
        test: /\.css$/i, // Handles .css files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i, // Handles .scss (SASS) files
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(webp|png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Handles image files
        generator: {
          filename: 'assets/images/[name][hash][ext][query]', // Customize output directory
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing .js and .jsx files without specifying extension
  },
};
