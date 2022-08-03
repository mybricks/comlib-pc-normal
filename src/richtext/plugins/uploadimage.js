export default function uploadimage(props) {
  // let globalEditor
  const { click, editor } = props 
  const global = (window).tinyMCE.util.Tools.resolve('tinymce.PluginManager');

  function selectLocalImages(editor) {		
      // if (!globalEditor) {
      //   globalEditor = editor
      // }
      // globalEditor = editor
      click('uploadimage')
  }

  function selectLocalFullScreen(editor) {
    // if (!globalEditor) {
    //   globalEditor = editor
    // }
    // globalEditor = editor
    click('customfullscreen')
  }

  function selectLocalFullScreenExit(editor) {
    click('customfullscreenexit')
  }


  const register$1 = function (editor) {
    // if (!globalEditor) {
    //   globalEditor = editor
    // }
    // globalEditor = editor
    editor.ui.registry.addButton('uploadimage', {
      icon: 'image',
      tooltip: '上传图片',
      onAction: function () {
        selectLocalImages(editor)
      }
    });
    editor.ui.registry.addMenuItem('uploadimage', {
      icon: 'image',
      text: '上传图片',
      onAction: function () {
        selectLocalImages(editor)
      }
    });

    editor.ui.registry.addButton('uploadVideo', {
      icon: 'customvideo',
      tooltip: '上传视频',
      onAction: function () {
        click('uploadVideo');
      }
    });
    editor.ui.registry.addMenuItem('uploadVideo', {
      icon: 'customvideo',
      tooltip: '上传视频',
      onAction: function () {
        click('uploadVideo');
      }
    });

    editor.ui.registry.addButton('customfullscreen', {
      icon: 'fullscreen',
      tooltip: '展开',
      onAction: function () {
        selectLocalFullScreen(editor)
      }
    });
    editor.ui.registry.addMenuItem('customfullscreen', {
      icon: 'fullscreen',
      text: '展开',
      onAction: function () {
        selectLocalFullScreen(editor)
      }
    });
    editor.ui.registry.addButton('customfullscreenexit', {
      icon: 'fullscreenexit',
      tooltip: '收起',
      onAction: function () {
        selectLocalFullScreenExit(editor)
      }
    });
    editor.ui.registry.addMenuItem('customfullscreenexit', {
      icon: 'fullscreenexit',
      text: '收起',
      onAction: function () {
        selectLocalFullScreenExit(editor)
      }
    });
    // editor.ui.registry.addButton('customlink', {
    //   icon: 'link',
    //   tooltip: '链接',
    //   onAction: function () {
    //     selectLocalLink(editor)
    //   }
    // });
    // editor.ui.registry.addMenuItem('customlink', {
    //   icon: 'link',
    //   text: '链接',
    //   onAction: function () {
    //     selectLocalLink(editor)
    //   }
    // });
  };
  // const Buttons = { register: register$1 };

  function Plugin () {
    global.add('uploadimage', function (editor) {        
      // if (!globalEditor) {
      //   globalEditor = editor
      // }
      // globalEditor = editor
      // Buttons.register(editor);
    });
    global.add('customfullscreen', function (editor) {        
      // if (!globalEditor) {
      //   globalEditor = editor
      // }
      // globalEditor = editor
      // Buttons.register(editor);
    });
    global.add('customfullscreenexit', function (editor) {        
      // if (!globalEditor) {
      //   globalEditor = editor
      // }
      // globalEditor = editor
      // Buttons.register(editor);
    });
    global.add('uploadVideo', () => {});
    // global.add('customlink', function (editor) {        
    //   if (!globalEditor) {
    //     globalEditor = editor
    //   }
    //   globalEditor = editor
    //   Buttons.register(editor);
    // });
  }

  Plugin();

  register$1(editor);
  
  return {
    setUrl: (modal, editor) => {
      if (editor) {
        const dom = editor.dom;
        const { type, url } = modal;
        if (type === 'image') {
        
          editor.insertContent(dom.createHTML('img', {src: url}))
        }
        if (type === 'video') {
          editor.insertContent(dom.createHTML('video', {src: url, controls: true}))
        }
      }
    }
  }
}