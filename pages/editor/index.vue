<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="handleSubmit" @keydown="submitBtn">
            <ul class="error-messages">
              <div v-for="(err, errKey) in error" class="ng-scope">
                <li v-for="e in err" class="ng-binding ng-scope">{{ errKey }} {{e}}</li>
              </div>
            </ul>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input @keydown="addTag($event, article.tagText)" v-model="article.tagText" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <div class="tag-list">
                <span v-for="(tag, index) in article.tagList" :key="index" class="tag-default tag-pill ng-binding ng-scope">
                  <i class="ion-close-round" @click="deleteATag(index)"></i>
                  {{ tag }}
                </span>
              </div>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createArticles, getArticle, updateArticle } from '@/api/article';

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated',
  name: 'EditorIndex',
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: [], // TODO tagList交互问题，
        tagText: '',
      },
      error: {},
    };
  },
  computed: {
    isEdit() {
      return this.$route.params.slug;
    }
  },
  async mounted() {
    this.isEdit && await this.getMyArticle();
  },
  methods: {
    async getMyArticle() {
      const { data } = await getArticle(this.$route.params.slug);

      this.article = { ...this.article, ...data.article };
    },
    addTag(e, tag) {
      // 标识enter键
      if (e.keyCode === 13) {
        this.article.tagList = [...new Set([... this.article.tagList, tag])];
        this.article.tagText = '';
      }

    },
    deleteATag(index) {
      this.article.tagList.splice(index, 1);
    },
    handleSubmit(e) {
      this.isEdit ? this.updateMyArticle() : this.createArticle();
    },
    submitBtn(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    },
    async updateMyArticle() {
      try {
        const params = {
          ...this.article,
        };

        if (params.tagText) {
          params.tagList = [...params.tagList, params.tagText];
        }

        delete params.tagText;

        const { data } = await updateArticle({
          article: params,
        }, this.$route.params.slug);

        this.$router.push({
          name: 'article',
          params: {
            slug: this.$route.params.slug
          },
        });
      } catch (e) {
        console.dir(e);
        this.error = e.response.data.errors;
      }
    },
    async createArticle() {
      try {
        const params = {
          ...this.article,
        };

        if (params.tagText) {
          params.tagList = [...params.tagList, params.tagText];
        }

        delete params.tagText;

        const { data } = await createArticles({
          article: params,
        });

        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          },
        });
      } catch (e) {
        console.dir(e);
        this.error = e.response.data.errors;
      }
    }
  },
}
</script>

<style>

</style>
