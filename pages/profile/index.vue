<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div v-if="userData" class="col-xs-12 col-md-10 offset-md-1">
            <img :src="userData.image" class="user-img" />
            <h4>{{ userData.username }}</h4>
            <p>
              {{ userData.bio }}
            </p>

            <nuxt-link v-if="user.username === userData.username" class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>

            <button :disabled="userData.changeFollowing" @click="changeFollowState(userData)" v-else-if="!userData.following" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ userData.username }}
            </button>

            <button :disabled="userData.changeFollowing" @click="changeFollowState(userData)"v-else class="btn btn-sm action-btn ng-binding btn-secondary">
              <i class="ion-plus-round"></i>
              Unfollow {{ userData.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                    exact
                    :to="{
                      name: 'profile',
                      query: {
                        tab: 'My-Articles',
                      },
                    }"
                    class="nav-link"
                    :class="{ active: tab === 'My-Articles' }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                    class="nav-link"
                    exact
                    :class="{ active: tab === 'Favorited-Articles' }"
                    :to="{
                      name: 'profile',
                      query: {
                        tab: 'Favorited-Articles',
                      },
                    }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div v-if="!articleData || articleData.length === 0" class="article-preview">
            No articles are here... yet.
          </div>
          <div v-for="article in articleData" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link :to="`/profile/${article.author.username}`"><img :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link :to="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button :disabled="article.favoriteDisabled" @click="changeFavorite(article)" class="btn btn-outline-primary btn-sm pull-xs-right" :class="{ active: article.favorited }">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="`/article/${article.slug}`" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

        </div>

      </div>
      <!-- 分页列表 -->
      <nav v-if="total >1">
        <ul class="pagination">
          <li
              class="page-item"
              :class="{
                  active: item === page
                }"
              v-for="item in total"
              :key="item"
          >
            <nuxt-link
                class="page-link"
                :to="{
                    name: 'profile',
                    query: {
                      page: item,
                      tab: tab
                    }
                  }"
            >{{ item }}</nuxt-link>
          </li>
        </ul>
      </nav>
      <!-- /分页列表 -->
    </div>


  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getArticles, addFavorite, deleteFavorite } from '@/api/article';
import { getProfile, followUser, unfollowUser } from '@/api/user';

export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  async asyncData(context) {
    const { query, params } = context;
    let username = params.username;
    let tab = query.tab || 'My-Articles';
    let limit = 5;
    let page = Number.parseInt(query.page) || 1;

    const articlesParams = tab === 'My-Articles' ? {
      author: username
    } : {
      favorited: username
    };

    const [ { data }, { data: userData } ] = await Promise.all([
      getArticles({
        ...articlesParams,
        offset: (page - 1) * limit,
        limit,
      }), getProfile(username)])

    // 增加标识位置
    data.articles.map(item => item.favoriteDisabled = false);

    return {
      tab, // My-Articles  Favorited Articles
      page,
      articleData: data.articles || [],
      articlesCount: data.articlesCount,
      limit,
      userData: userData.profile || {},
    };
  },
  watchQuery: ['tab', 'page'],
  data() {
    return {
      // userData: {},
    };
  },
  computed: {
    ...mapState(['user']),
    total() {
      if (this.limit === 0) return 0;
      return Math.ceil(this.articlesCount / this.limit);
    }
  },
  async mounted() {
    // await this.getUserData();
  },
  methods: {
    async getUserData() {
      const { data } = await getProfile(this.$route.params.username);
      this.userData = data.profile;
    },
    async changeFavorite(article) {
      let changeFavoriteState = article.favorited ? deleteFavorite : addFavorite;
      article.favoriteDisabled = true;

      try {
        await changeFavoriteState(article.slug);
        article.favorited = !article.favorited;
        if (article.favorited) {
          article.favoritesCount += 1
        } else {
          article.favoritesCount -= 1
        }
      } catch (e) {
        // ...
      }

      article.favoriteDisabled = false;
    },
    async changeFollowState(userData) {
      let changeFollow = userData.following ? unfollowUser : followUser;
      userData.changeFollowing = true;
      try {
        await changeFollow(userData.username);

        userData.following = !userData.following;
      } catch (e) {
        // ..
      }

      userData.changeFollowing = false;
    }
  },
}
</script>

<style>

</style>
