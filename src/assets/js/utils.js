export {
    debounce,
    throttle
}
from 'lodash'

import {
    uniq
} from 'lodash'

/**
 * 页面类型与页面标题的对应
 */
export const PageType2Title = {
    'all': '全部',
    'share': '分享',
    'ask': '问答',
    'job': '招聘',
    'good': '精华',
    'message': '消息',
    'about': '关于',
    'topic': '主题',
    'addTopic': '新建主题',
    'user': '用户信息',
    'dev': '测试'
}

/**
 * 得到主题的标签名
 * @param {Boolean} top 
 * @param {Boolean} good 
 * @param {String} tab 
 */
export function getTopicLabel(top, good, tab) {
    let str = ''

    if (top) {
        str = '置顶'
    } else if (good) {
        str = '精华'
    } else {
        str = PageType2Title[tab]
    }

    if (!str) {
        str = '暂无'
    }

    return str
}

/**
 * 从文本中提取出@username 标记的用户名数组
 * @param {String} text 文本内容
 * @return {Array} 用户名数组
 */
const fetchUsers = (text) => {
    if (!text) {
        return [];
    }

    var ignoreRegexs = [
        /```.+?```/g, // 去除单行的 ```
        /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
        /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
        /^.*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
        /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
        /\[@.+?\\]\(\/.+?\)/g // 已经被 link 的 username
    ];

    ignoreRegexs.forEach((ignoreRegex) => {
        text = text.replace(ignoreRegex, '');
    });

    var results = text.match(/@[a-z0-9\-_]+\b/igm);
    var names = [];
    if (results) {
        for (var i = 0, l = results.length; i < l; i++) {
            var s = results[i];
            // remove leading char @
            s = s.slice(1);
            names.push(s);
        }
    }
    names = uniq(names);
    return names;
};

/**
 * 根据文本内容，替换为数据库中的数据
 * @param {String} text 文本内容
 * @param {Function} callback 回调函数
 */
export function linkUsers(text) {
    var users = fetchUsers(text);
    for (var i = 0, l = users.length; i < l; i++) {
        var name = users[i];
        text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')');
    }
    return text;
};