<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="submitUser">
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="currentUser.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="currentUser.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="currentUser.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="currentUser.email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="currentUser.password" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
            <hr />
            <button @click="logout" class="btn btn-outline-danger">
              Or click here to logout.
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// 客户端加载js-cookie
const Cookie = process.client ? require('js-cookie') : undefined;
import { mapMutations, mapState } from 'vuex';
import { update } from '@/api/user';

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data() {
    return {
      currentUser: {
        image: null,
        username: '',
        email: '',
        password: '',
        bio: '',
      },

    };
  },
  computed: {
    ...mapState(['user']),
  },
  mounted() {
    // 合并选项
    for (let key in this.currentUser) {
      this.currentUser[key] = this.user[key] || this.currentUser[key];
    }
  },
  methods: {
    ...mapMutations(['clearUser', 'setUser']),
    async submitUser() {
      if (!this.currentUser.password) {
        delete this.currentUser.password;
      }

      try {
        const { data } = await update({
          user: { ...this.currentUser },
        });

        if (data && data.user) {
          this.setUser(data.user);

          Cookie.set('user', data.user);

          this.$router.push({
            name: 'profile',
            params: {
              username: data.user.username,
            },
          });
        }
      } catch (e) {
        // ..
        console.dir(e);
      }
    },
    logout() {
      // 清除用户登录状态

      Cookie.remove('user');
      this.clearUser();

      this.$router.push('/');
    }
  },
}
</script>

<style>

</style>
