'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
function filterKeys(obj, func) {
  var res = {};
  Object.keys(obj).filter(func).forEach(function (v) {
    res[v] = obj[v];
  });
  return res;
}
module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the polished ' + chalk.red('generator-super-simple-module') + ' generator!'
    ));
    
    var prompts = [{
      name: 'name',
      message: 'What should it be called?',
      default: this.destinationRoot().split(path.sep).pop()
    }, {
      name: 'author',
      message: 'What is your name?',
      default: this.config.get('author')
    }, {
      name: 'version',
      message: 'What is the version?',
      default: '0.1.0'
    }, {
      name: 'email',
      message: 'What is your email?',
      default: this.config.get('email')
    }, {
      name: 'desc',
      message: 'What should be the description?'
	}, {
      name: 'homepage',
      message: 'What is your url?',
      default: this.config.get('homepage')
	}, {
      name: 'keywords',
      message: 'What keywords? (Space separated)',
      filter: function (data) {
        return data.split(' ');
      }
	}, {
      name: 'eslint',
      type: 'confirm',
      message: 'Should I use eslint?',
      default: true
	}, {
      name: 'mocha',
      type: 'confirm',
      message: 'Should the tests use mocha?',
      default: false
	}, {
      name: 'test',
      message: 'What is the test command?',
      default: 'node test.js'
	}, {
      name: 'lint',
      message: 'What should the lint command be?',
      when: function (ans) {
        return !ans.eslint;
      }
    }, {
      name: 'user',
      message: 'What is you github username?',
      default: this.config.get('user')
    }, {
      name: 'repo',
      message: 'What repo is it in?',
      default: function (ans) {
        return ans.name;
      }
    }, {
      name: 'cli',
      message: 'Should it include a cli?',
      type: 'confirm'
    }, {
      name: 'license',
      message: 'What license?',
      type: 'list',
      choices: ['MIT'],
      default: this.config.get('license')
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      props.lint = props.lint || (props.eslint && 'eslint *.js');
      props.git = 'https://github.com/' + props.user + '/' + props.repo;
      var keysToStore = ['user', 'author', 'homepage', 'email', 'license'];
      this.config.set(filterKeys(props, function (v) {
        return keysToStore.includes(v);
      }));
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
		this.templatePath('index.js'),
		this.destinationPath('index.js')
	);
    this.fs.copyTpl(
      this.templatePath('test.js.ejs'),
      this.destinationPath('test.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.write(
      this.destinationPath('.gitignore'),
      'node_modules'
    );
    if (this.props.cli) {
      this.fs.copyTpl(
        this.templatePath('cli.js.ejs'),
        this.destinationPath('cli.js'),
        this.props
      );
    }
  },

  install: function () {
    this.npmInstall();
  }
});
