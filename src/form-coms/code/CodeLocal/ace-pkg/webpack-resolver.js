/** default beautify */
ace.config.setModuleUrl('ace/ext/beautify', require('./ext-beautify.js'));
ace.config.setModuleUrl('ace/ext/language_tools', require('./ext-language_tools.js'));
/** language mode */
ace.config.setModuleUrl('ace/mode/css', require('./mode-css.js'));
ace.config.setModuleUrl('ace/mode/html', require('./mode-html.js'));
ace.config.setModuleUrl('ace/mode/java', require('./mode-java.js'));
ace.config.setModuleUrl('ace/mode/javascript', require('./mode-javascript.js'));
ace.config.setModuleUrl('ace/mode/json', require('./mode-json.js'));
ace.config.setModuleUrl('ace/mode/sql', require('./mode-sql.js'));
ace.config.setModuleUrl('ace/mode/text', require('./mode-text.js'));
/** theme */
ace.config.setModuleUrl('ace/theme/xcode', require('./theme-xcode.js'));
/** worker (语法检查) */
// ace.config.setModuleUrl('ace/mode/javascript_worker', require('./ace-pkg/worker-javascript.js'));
/** snippets */
ace.config.setModuleUrl('ace/snippets/css', require('./snippets/css.js'));
ace.config.setModuleUrl('ace/snippets/html', require('./snippets/html.js'));
ace.config.setModuleUrl('ace/snippets/java', require('./snippets/java.js'));
ace.config.setModuleUrl('ace/snippets/javascript', require('./snippets/javascript.js'));
ace.config.setModuleUrl('ace/snippets/json', require('./snippets/json.js'));
ace.config.setModuleUrl('ace/snippets/sql', require('./snippets/sql.js'));
ace.config.setModuleUrl('ace/snippets/text', require('./snippets/text.js'));
