import { request } from '@/plugins/request'


// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 更新用户信息
export const update = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data,
  });
};

// 获取个人信息
export const getProfile = username => {
  return request({
    url: `/api/profiles/${username}`,
    method: 'GET'
  });
};

// follow用户
export const followUser = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'POST'
  });
};

// unfollow用户
export const unfollowUser = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'DELETE'
  });
};
