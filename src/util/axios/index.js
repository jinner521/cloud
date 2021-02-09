// 引入封装好的  axios
import http from "./axios"

// 封装推荐歌单的接口
export function personalized(params){
    return http.get('/personalized',{params})
}

// 封装热门榜单的接口
export function hotList(){
    return http.get('/playlist/detail?id=3778678')
}

// 封装 音乐url 的接口
export function getSongUrl(params){
    return http.get('/song/url',{params})
}

// 封装 音乐歌词 的接口
export function getLyric(params){
    return http.get('/lyric',{params})
}

// 封装 最新音乐 的接口
export function getNewsong(params){
    return http.get('/personalized/newsong',{params})
}

// 封装 搜索 的接口
export function getSearch(params){
    return http.get('/cloudsearch',{params})
}
// 获取歌曲详情
export function getMusicDetail(params){
    return http.get('/song/detail',{params})
}

// 封装 热搜歌曲 的接口
export function getHotSearch(keywords){
    return http.get('/search/hot/detail',{keywords})
}

// 封装 歌曲详情 的接口  
export function getPlayList(params){
    return http.get('/playlist/detail',{params})
}



