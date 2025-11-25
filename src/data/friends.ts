// src/data/friends.ts

export interface Friend {
  name: string;
  desc: string;
  avatar: string; // 图片链接
  url: string;    // 跳转链接
  color?: string; // (可选) 卡片强调色，暂时保留接口
}

export const friendsData: Friend[] = [
    { 
    name: "Vahiru's Blog", 
    desc: "愿你能被全世界温柔以待", 
    avatar: "https://avatars.githubusercontent.com/u/84584330?v=4",
    url: "https://vahiru.is-cute.cat"
    }
];
