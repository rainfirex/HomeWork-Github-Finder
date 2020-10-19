<template>
    <div class="wrapper">
        <div class="wrapper-content wrapper-content--fixed">
            <section>
                <div class="container">

                    <!--error-->
                    <div class="error" v-if="error" style="margin-bottom: 20px;">
                        <p>{{ error }}</p>
                    </div>

                    <!--search-->
                    <search :value="search" placeholder="Type username..." @search="search = $event"/>

                    <!--buttons-->
                    <button v-if="!repos" class="btn btnPrimary" @click="getRepos">Search</button>
                    <button v-else class="btn btnPrimary" @click="getRepos">Search Again!</button>

                    <!--wrapper-->
                    <div class="repos__wrapper" v-if="repos">

                        <div class="user" v-if="user.name">
                            <h3 class="title">User info</h3>
                            <p>name: {{ user.name}}</p>
                            <p>login: {{ user.login}}</p>
                            <p>bio: {{ user.bio}}</p>
                            <p>public repos: {{ user.public_repos}}</p>
                            <p>public gists: {{ user.public_gists}}</p>
                            <div>
                                <img :src="user.avatar_url" alt="avatar">
                            </div>
                        </div>

                        <div class="repos" v-if="reposSort.length > 0">
                            <h3 class="title">List repos</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th @click="sort('name')">Name &#8595;</th>
                                        <th @click="sort('stargazers_count')">Star &#8595;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="repo in reposSort" :key="repo.id">
                                        <td><a class="link" target="_blank" :href="repo.html_url">{{ repo.name }}</a></td>
                                        <td><span>{{ repo.stargazers_count }} ⭐</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="container">
                                <div class="button-list">
                                    <div class="btn btnPrimary" @click="prevPage"> &#8592;</div>
                                    <div class="btn btnPrimary" @click="nextPage"> &#8594;</div>
                                </div>
                            </div>
                        </div>



                    </div>

                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import search from '../components/Search.vue'
    import axios from 'axios';
    export default {
        components: { search },
        data() {
            return {
                user: {
                    login: '',
                    name: '',
                    bio: '',
                    avatar_url: '',
                    public_repos: '',
                    public_gists: '',
                    repos_url: ''
                },
                search: 'vedees',
                repos: [],
                sortColumn: 'name',
                typeSort: 'asc',
                page: {
                    current: 1, //тек. страница
                    length: 5 // Элементов на странице
                }
            }
        },
        computed: {
            error() {
                return this.$store.getters.getError;
            },
            reposSort() {
                return this.repos.sort((a, b) => {
                    let mod = 1;
                    if (this.typeSort === 'desc') mod = -1;
                    if (a[this.sortColumn] < b[this.sortColumn]) {
                        return -1 * mod;
                    }
                    if (a[this.sortColumn] > b[this.sortColumn]) {
                        return 1 * mod;
                    }
                    return 0;
                }).filter((row, index) => {
                        let start = (this.page.current - 1) * this.page.length;
                        let end = this.page.current * this.page.length;
                        if (index >= start && index < end) return true;
                    })
            }
        },
        methods: {
            getRepos() {
                this.$store.dispatch('setError', null);

                axios.get(`https://api.github.com/users/${this.search}`)
                    .then(response => {
                        const d = response.data;

                        this.user.login        = d.login;
                        this.user.name         = d.name;
                        this.user.bio          = d.bio;
                        this.user.public_repos = d.public_repos;
                        this.user.public_gists = d.public_gists;
                        this.user.repos_url    = d.repos_url;
                        this.user.avatar_url   = d.avatar_url;

                        axios.get(this.user.repos_url)
                            .then(response => {
                                this.repos = response.data;
                            })
                            .catch(() => {
                                this.repos = null;
                                this.$store.dispatch('setError', 'Can`t find this repos')
                            });

                    })
                    .catch(() => {
                        this.repos = null;
                        this.$store.dispatch('setError', 'Can`t find this user')
                    });
            },
            sort(columnName) {
                if (columnName === this.sortColumn) {
                    // Смена типа сортировки
                    this.typeSort = this.typeSort === 'asc' ? 'desc' : 'asc';
                }

                this.sortColumn = columnName;
            },
            prevPage() {
                if (this.page.current > 1) {
                    this.page.current -= 1
                }
            },
            nextPage() {
                if ((this.page.current * this.page.length) < this.repos.length) {
                    this.page.current += 1;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
  .container{
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  button {
    margin-top: 40px !important;
  }

  .repos__wrapper{
      width: 500px;
      margin: 30px 0;
      text-align: center;
  }

  .user, .repos{
      padding: 5px;
      line-height: 35px;
      border: solid 1px #d0d0d0;
      background: white;
  }
  .user{
      border-bottom: none;
  }

  .repos-item{}
  .repos-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #dbdbdb;
  }
    /*.repos-info:last-child {*/
        /*margin-bottom:0;*/
        /*border-bottom: none;*/
    /*}*/
</style>