import react from "react";
// 引入 jQuery 库
import jq from "jquery"

// 引入 nodeapi
import qsString from "querystring"

// 利用并发处理如调取接口
// 引入核心库
import axios from "axios"

//引入play.css文件
import '../assets/css/play.css'
//引入你封装好的接口
import { getLyric, getSongUrl, getMusicDetail } from "../util/axios";



class play extends react.Component {
  constructor() {
    super();
    this.state = {
      bgImg: "",
      songName: "",
      singer: "",
      songUrl: "",
      lyric: "",
      playTime: "00:00",
      flag: false, //标识位 用来操控音乐的播放
    };
     //闯进一个音乐图标的ref
     this.playIcon = react.createRef();
    // 创建一个音乐播放器的ref
    this.audio = react.createRef()
  }
  componentDidMount() {
    //   获取query参数
    // console.log(this.props, "this.props");
    // let query = this.props.location.search.slice(1);
    // query = qsString.parse(query);
    let query = this.props.location.state.id

    //组件一加载就调用并发处理
    //400没有传入必传参数
    axios.all([getMusicDetail({ ids: query.id }), getSongUrl({ id: query.id }), getLyric({ id: query.id })])
    .then(axios.spread((detail, songUrl, lyric) => {
      if (detail.code === 200) {
        this.setState({
              bgImg: detail.songs[0].al.picUrl,
              songName: detail.songs[0].name,
              singer: detail.songs[0].ar[0].name,
            });
          }
          if (songUrl.code == 200) {
            this.setState({
              songUrl: songUrl.data[0].url,
            });
          }
          if (lyric.code == 200) {
          let lyricInfo = lyric.lrc.lyric
          //定义一个正则 ，正则的目的就是去除 []
          let reg = /\[(.*?)](.*)/g
          console.log(lyricInfo,'歌词字符串');
          //执行字符串替换，也可以按照我们的规则，按照正则的规则
          //replace() 它可以有两个参数，第一参数要匹配的眼球，二一个参数是 根据匹配返回的结果
          //指定一个空对象
          let obj = {}
          lyricInfo.replace(reg,(a,b,c)=>{
              //[00:00.000] 作词 : 小雨滴/陈澈 aaaa
              //00:00.000 bbbbb
              //作曲 : 小雨滴 cccccc
              // console.log(a,'aaaa');
              // console.log(b,'bbbbb');
              // console.log(c,'cccccc');
              b= b.slice(0,5)
              obj[b]=c
          })
          console.log(obj,'对象');
            this.setState({
              lyric: obj,
            },()=>{
                //获取到audio属性
                console.log(this.audio.current,'对象');
                let audio = this.audio.current
                //实时监控音乐器播放
                audio.ontimeupdate = ()=>{
                  //currentTime 正在播放的时间（以秒记录)
                  //调用封装好的时间转化函数，用来转化正在播放的时间
                    // console.log(audio.currentTime, '正在播放时间');
                  let nowTimer=  this.formateTime(audio.currentTime)
                  console.log(nowTimer, '正在播放时间');
                   //剔除掉没有歌词的时间 // 在json格式中查找key 用js中 in
                   if (nowTimer in this.state.lyric) {
                    //查到了歌词和播放时间一致的时候，我们就赋给playTime，证明这句在播放，我就加高亮
                    this.setState(
                      {
                        playTime: nowTimer,
                      }, () => {
                        //调用歌词滚动
                        this.moveLyric();
                      }
                    );
                  }
                }
            });
          }
        })
      );
  }
// 封时间转化函数
formateTime(timer){
  //得到的数据是 1s 2s  3.4s =>  00:00
  let minutes=(Math.floor( timer/60)+'').padStart(2,'0')
  let seconds=(Math.floor( timer%60)+'').padStart(2,'0')
  console.log( minutes,seconds);
  return `${minutes}:${seconds}`
}
 //封装一个歌词滚动的事件
 moveLyric() {
  //匹配到那一句是高亮
  let active = document.getElementsByClassName("active")[0];
  //找出高亮所在的位置
  let index = jq(".geci_box").children().index(active);
  //设置初识位移值 31
  let offSet = 31;
  //超出值，就加上 translateY
  if (active.offsetTop > offSet) {
    jq(".geci_box").css("transform", `translateY(-${index * offSet}px)`);
  }
  // console.log(index, "索引");
}
  //音乐播放事件
  toPlay() {
    this.setState(
      {
        flag: !this.state.flag,
      },
      () => {
        //如果flag是真，是音乐暂停，图标出现
        if (this.state.flag) {
          this.playIcon.current.style.display='block'
          this.audio.current.pause();
        } else {
          //如果flag是假，是音乐播放，图标隐藏
          this.audio.current.play();
          this.playIcon.current.style.display = 'none'
        }
      }
    );
  }
  render() {
    const { img, bgImg, songName, singer, songUrl, lyric,playTime } = this.state;
    return (
      <div className="play">
        <div className="play_top">
          <img src={img} />
        </div>
        <div onClick={this.toPlay.bind(this)} className="play_img_all">
          <i ref={this.playIcon} className="play_icon"></i>
          <div className="play_img_box">
            <div className="small_img">
              <img src={bgImg} alt="" />
            </div>
          </div>
        </div>
        <div className="play_txt">
          <div className="play_txt_name">
            <span>{songName}</span>- <span className="singer">{singer}</span>
          </div>
          <div className="play_txt_geci">
            <div className="geci_box">
                {/* 在React中对象不能循环！！！ Object.entries()把对象转化成数组的形式 */}
                {Object.entries(lyric).map((item, idx) => {
                if (playTime == item[0]) {
                  // 匹配到的歌词加高亮
                  return (
                    <p className="active" key={idx}>
                      {item[1]}
                    </p>
                  );
                } else {
                  return <p key={idx}>{item[1]}</p>;
                }
              })}
            </div>
          </div>
        </div>
        <div className="audio_box">
          {/* 音乐播放器 */}
          <audio ref={this.audio} src={songUrl} autoPlay></audio>
        </div>
      </div>
    );
  }
}

export default play;
