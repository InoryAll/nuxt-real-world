<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <template v-if="article.author.username === user.username">
      <nuxt-link class="btn btn-outline-secondary btn-sm" :to="`/editor/${article.slug}`">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button class="btn btn-outline-danger btn-sm" @click="deleteArticle(article)">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>

    <template v-else>
      <button
          :disabled="article.author.changeFollowing"
          class="btn btn-sm btn-outline-secondary"
          @click="changeFollowState(article)"
          :class="{
        active: article.author.following
      }"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
          :disabled="article.favoriteDisabled"
          class="btn btn-sm btn-outline-primary"
          @click="changeFavoriteState(article)"
          :class="{
        active: article.favorited
      }"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { followUser, unfollowUser } from '@/api/user';
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article';

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async deleteArticle(article) {
      try {
        await deleteArticle(article.slug);
        this.$router.push('/');
      } catch (e) {
        // ...
      }
    },
    async changeFollowState(article) {
      let changeFollow = article.author.following ? unfollowUser : followUser;
      article.author.changeFollowing = true;
      try {
        await changeFollow(article.author.username);

        article.author.following = !article.author.following;
      } catch (e) {
        // ..
      }

      article.author.changeFollowing = false;
    },
    async changeFavoriteState(article) {
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
    }
  },
}
</script>

<style>

</style>
