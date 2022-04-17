import Plugin from './Plugin';
export default function ({ types }) {
  let plugins = null;

  /**
  * 从类中继承方法并利用 apply 改变 this 指向，并传递 path , state 参数
  */
  function applyInstance (method, args, context) {
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }

  /**
   *  Program 入口初始化插件 options 的数据结构
   */
  const Program = {
    enter (path, { opts = {} }) {
      assert(opts.libraryName, 'libraryName should be provided');
      plugins = [
        new Plugin(
          opts.libraryName,
          opts.libraryDirectory,
          opts.style,
          opts.styleLibraryDirectory,
          opts.customStyleName,
          opts.camel2DashComponentName,
          opts.camel2UnderlineComponentName,
          opts.fileName,
          opts.customName,
          opts.transformToDefaultImport,
          types,
        ),
      ];
      applyInstance('ProgramEnter', arguments, this);
    },
    exit () {
      applyInstance('ProgramExit', arguments, this);
    },
  };
  const ret = {
    visitor: { Program }, // 对整棵AST树的入口进行初始化操作
  };
  return ret;
}