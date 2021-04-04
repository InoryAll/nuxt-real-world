<template>
  <div>
    <form @submit.prevent="addOneComment(article)" class="card comment-form">
      <div class="card-block">
        <textarea v-model="comment" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
        Post Comment
        </button>
      </div>
    </form>

    <div
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>

        <span @click="deleteTheComment(article, comment)" class="mod-options" v-if="comment.author.username === user.username">
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getComments, addComment, deleteComment } from '@/api/article'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comment: '',
      comments: [] // 文章列表
    }
  },
  async mounted () {
    await this.getComment();
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async getComment() {
      const { data } = await getComments(this.article.slug || this.$route.params.slug)
      this.comments = data.comments
    },
    async addOneComment(article) {
      try {
        await addComment({
          comment: {
            body: this.comment,
          },
        }, this.$route.params.slug);

        await this.getComment();
      } catch (e) {

      }
    },
    async deleteTheComment(article, comment) {
      try {
        await deleteComment({
          slug: this.$route.params.slug,
          id: comment.id
        });

        await this.getComment();
      } catch (e) {
        // ...
      }
    }
  },
}
</script>

<style>

</style>
