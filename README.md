# 简介

本项目使用angular框架，使用`ngx-admin` 作为dashboard模板进行开发。

### ngx-admin 

[Who uses ngx-admin?](https://github.com/akveo/ngx-admin/issues/1645)| [Documentation](https://akveo.github.io/ngx-admin?utm_campaign=ngx_admin%20-%20home%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=github_readme_documentation_link) | [Installation Guidelines](https://akveo.github.io/ngx-admin/docs/getting-started/what-is-ngxadmin?utm_campaign=ngx_admin%20-%20home%20-%20ngx_admin%20github%20readme&utm_source=ngx_admin&utm_medium=referral&utm_content=github_readme_installation_guidelines) | [Angular templates](https://www.akveo.com/templates?utm_campaign=services%20-%20github%20-%20templates&utm_source=ngx_admin&utm_medium=referral&utm_content=github%20readme%20top%20angular%20templates%20link)

# 开发&使用说明

#### 代理

##### 开发过程中：

注意查看代理设置 [proxy.js](proxy.js) ，这里主要使用两个接口，一个为`/api`接口，主要用于请求需求信息，一个为`/cache`接口，主要用于请求图片信息。

##### 部署中：

使用命令：

```
# 打包命令
ng build --aot --prod --output-hashing=all
```

后将`dist`文件夹中文件上传至`frontend`项目。

> Todo：这部分可以做成自动化，但因为`js`的天然弊端，这个node_modules，天然会很大，不是很想做这个的镜像。

#### 开发运行

在此目录，打开vscode，使用某个插件（我忘了是哪个了，找找），运行ctrl+shift+b。

既是命令：

```cmd
ng serve --proxy-config proxy.js
```

开始测试。