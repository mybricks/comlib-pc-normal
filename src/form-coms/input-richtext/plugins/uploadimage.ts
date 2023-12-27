export default function uploadimage(props) {
  const { click, editor } = props;
  const global = window.myTinymce.util.Tools.resolve('myTinymce.PluginManager');

  function selectLocalImages(editor) {
    click('uploadimage');
  }

  function selectLocalFullScreen(editor) {
    click('customfullscreen');
  }

  function selectLocalFullScreenExit(editor) {
    click('customfullscreenexit');
  }

  const register$1 = function (editor) {
    editor.ui.registry.addButton('uploadimage', {
      icon: 'image',
      tooltip: '上传图片',
      onAction: function () {
        selectLocalImages(editor);
      }
    });
    editor.ui.registry.addMenuItem('uploadimage', {
      icon: 'image',
      text: '上传图片',
      onAction: function () {
        selectLocalImages(editor);
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
        selectLocalFullScreen(editor);
      }
    });
    editor.ui.registry.addMenuItem('customfullscreen', {
      icon: 'fullscreen',
      text: '展开',
      onAction: function () {
        selectLocalFullScreen(editor);
      }
    });
    editor.ui.registry.addButton('customfullscreenexit', {
      icon: 'fullscreenexit',
      tooltip: '收起',
      onAction: function () {
        selectLocalFullScreenExit(editor);
      }
    });
    editor.ui.registry.addMenuItem('customfullscreenexit', {
      icon: 'fullscreenexit',
      text: '收起',
      onAction: function () {
        selectLocalFullScreenExit(editor);
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

  function Plugin() {
    global.add('uploadimage', function (editor) {});
    global.add('customfullscreen', function (editor) {});
    global.add('customfullscreenexit', function (editor) {});
    global.add('uploadVideo', () => {});
  }

  Plugin();

  register$1(editor);

  return {
    setUrl: (modal) => {
      if (editor) {
        const dom = editor.dom;
        const { type, url } = modal;
        if (type === 'image') {
          editor.insertContent(dom.createHTML('img', { src: url, style: 'max-width: 100%;' }));
        }
        if (type === 'video') {
          editor.insertContent(dom.createHTML('video', { src: url, controls: true }));
        }
      }
    }
  };
}
