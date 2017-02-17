# iflux2-starter

iflux2的快速项目构建的基础项目

配合iflux2-scaffold 可以快速的创建iflux2的项目


# [iflux2-scaffold](https://github.com/brothers-js/iflux2-scaffold)

> 工欲善其事 必先利其器

在怎么强调都不过分？遥看Django和RoR都有非常好用的脚手架功能，快速的生成项目骨架，管理项目的依赖，以及一些自动化功能。

大大的增强了我们的开发体验。

Ok，It's time to build it.

> 请使用node6.0+版本

## prerequisite

```sh
npm install -g yarn
```


## install

```sh
  npm install -g iflux2-scaffold
  # or
  yarn global add iflux2-scaffold
```

## Getting Started

```text

➜  iflux2-scaffold git:(master) iflux2

  Usage: iflux2 [options] [command]


  Commands:

    new [project-name]  create a new iflux2-project
    newapp [app-name]   create a new iflux2-app
    update              sync iflux2-starter
    help [cmd]          display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```


```sh

  #create project
  iflux2 new hello

  #create app
  cd hello
  iflux2 newapp blog

  #start project
  yarn start # npm start 

  # http://localhost:3000
 ```

