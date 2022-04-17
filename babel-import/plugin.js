function normalizeCustomName (originCustomName) {
  if (typeof originCustomName === 'string') {
    const customeNameExports = require(originCustomName);
    return typeof customeNameExports === 'function'
      ? customeNameExports
      : customeNameExports.default;// 如果customeNameExports不是函数就导入{default:func()}
  }
  return originCustomName;
}

export default class Plugin {
  constructor(
    libraryName,
    libraryDirectory,
    style,
    styleLibraryDirectory,
    customStyleName,
    camel2DashComponentName,
    camel2UnderlineComponentName,
    fileName,
    customName,
    transformToDefaultImport,
    types, // babel-types
    index = 0, // 标记符
  ) {
    this.libraryName = libraryName; // 库名
    this.libraryDirectory = typeof libraryDirectory === 'undefined' ? 'lib' : libraryDirectory; // 包路径
    this.style = style || false; // 是否加载 style
    this.styleLibraryDirectory = styleLibraryDirectory; // style 包路径
    this.camel2DashComponentName = camel2DashComponentName || true; // 组件名是否转换以“-”链接的形式
    this.transformToDefaultImport = transformToDefaultImport || true; // 处理默认导入
    this.customName = normalizeCustomName(customName); // 处理转换结果的函数或路径
    this.customStyleName = normalizeCustomName(customStyleName); // 处理转换结果的函数或路径
    this.camel2UnderlineComponentName = camel2UnderlineComponentName; // 处理成类似 time_picker 的形式
    this.fileName = fileName || ''; // 链接到具体的文件，例如 antd/lib/button/[abc.js]
    this.types = types; // babel-types
    this.pluginStateKey = `importPluginState${index}`;
  }

  getPluginState (state) {
    if (!state[this.pluginStateKey]) {
      // eslint-disable-next-line no-param-reassign
      state[this.pluginStateKey] = {}; // 初始化标示
    }
    return state[this.pluginStateKey]; // 返回标示
  }
  ProgramEnter (_, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specified = Object.create(null); // 导入对象集合
    pluginState.libraryObjs = Object.create(null); // 库对象集合 (非 module 导入的内容)
    pluginState.selectedMethods = Object.create(null); // 存放经过 importMethod 之后的节点
    pluginState.pathsToRemove = []; // 存储需要删除的节点
    /**
     * 初始化之后的 state
     * state:{
     *    importPluginState「Number」: {
     *      specified:{},
     *      libraryObjs:{},
     *      select:{},
     *      pathToRemovw:[]
     *    },
     *    opts:{
     *      ...
     *    },
     *    ...
     * }
     */
  }

}