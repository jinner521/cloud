import React from 'react'
//引入静态资源图片
import search from '../assets/images/search.png'
//引入css文件
import '../assets/css/search.css'
// 引入封装好的接口
import { getSearch, getHotSearch,  } from "../util/axios/index"
import { Link } from 'react-router-dom'
class Search extends React.Component {
    constructor() {
        super()
        //state 设置数据，当视图需要这个数据作为渲染的时候，
        // 我们把这个数据定义到state中。如果这个数据只作为中间值，不建议放到state ( )
        this.state = {
            // val: '',
            hotList: [],
            searchList: [],
             flag:false
        }
        this.val=''
        this.inp = React.createRef()
    }
    // 封装一个键盘抬起事件
    keyUp(e) {
        // this.setState({
        //     val: e.target.value,
        // })
        //把输入的内容赋值给val
        this.val = e.target.value

        // 剔除空状态
        if (e.target.value === "" || e.keyCode===32) {
            console.log(this.val, "value值");
            // 1.把搜索结果列表置空
            this.setState({
                searchList:[]
            })
            //2.把中间值val置空 
           return
          
        }
         //  调取搜索接口
        this.getSearchList(e.target.value)
    }
    componentDidMount() {
        this.getHotSearchList()
    }
    //封装一个 搜索方法
    getSearchList(keywords) {
        // 点击除了调取接口，还要把值赋给input框
        this.inp.current.value = keywords
        getSearch({ keywords })
            .then(res => {
                if (res.code === 200) {
                    console.log(res, "搜索方法");
                    this.setState({
                        searchList: res.result.songs.filter((item, i) => i < 10)
                    })

                }
            })
            .catch(err => {
                console.log(err, "请求失败");
            })
    }
    //封装一个 热搜歌曲 的方法
    getHotSearchList() {
        getHotSearch()
            .then(res => {
                if (res.code === 200) {
                    console.log(res, "热搜歌曲");
                    this.setState({
                        hotList: res.data.filter((item, i) => i < 10)
                    })
                }

            })
    }

    // 点击x  触发清空事件
    del() {
        this.inp.current.value = '';
      //把搜索结果置空
        this.setState({
          searchList:[]
        })
       
    }
     //封装一个跳转播放的方法
//   goPlay(id){
//     //跳转播放
//     this.props.history.push('/play?id='+id)
//   }
    render() {
        const {  hotList, searchList } = this.state;
        //这一步实现的是，当点击热搜列表的时候，实现input有值
        this.val=this.inp.current? this.inp.current.value : ''
        //定义视图变量
        // 热搜列表
        let searchListInfo = <ul className="searchList" >
            {
                searchList.map((item) => {
                    return (
                        <Link  to={
                            {
                                pathname: '/play',
                                state: {
                                    id: item.id,
                                    picUrl:item.al.picUrl
                                }
                            }
                        } key={item.id} className="hotcont">
                            <li className="song" > 
                          
                                <div className="song_name">
                                    <div className="name">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="song_author">
                                    <div className="sq_icon">
                                        <div className="icon">SQ</div>
                                    </div>
                                    {item.ar[0].name} -  {item.al.name}
                                </div>
                                <div className="song_icon">
                                    <i className="iconfont icon-bofang"></i>
                                </div>



                            </li></Link>

                    );
                })
            }
        </ul>
        let   hotSearchInfo= <div className='hotsearch'>
            <p>热门搜索</p>
            <ul className='list'>
                {
                    hotList.map((item) => {
                        return (
                            <li className='hotsong' key={item.score} 
                            onClick={this.getSearchList.bind(this, item.searchWord)}>
                                <div className="font">
                                    {item.searchWord}
                                </div>
                            </li>
                        );
                    })
                }

            </ul>
        </div>
        return (<div>
            <div className="search">
                <img src={search} alt="" />
                <input type="text" placeholder='搜索歌曲、歌手、专辑' ref={this.inp} onKeyUp={this.keyUp.bind(this)} />
                {this.val ? <span onClick={this.del.bind(this)}>x</span> : ''}
            </div>
            {/* 利用条件判断 判断是否显示搜索列表 */}
            {searchList.length>0 ?  searchListInfo:hotSearchInfo}
        </div>)
    }
}
export default Search