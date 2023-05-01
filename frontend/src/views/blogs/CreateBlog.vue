<template>
  <div class="container is-widescreen">
    <section class="section" v-if="error">
      <div class="container is-widescreen">
        <div class="notification is-danger">
          <!-- <%= error.code + ': ' + error.sqlMessage %> -->
          <!---->
          {{ error }}
        </div>
      </div>
    </section>
    <section class="hero">
      <div class="hero-body">
        <p class="title">Create new Blog</p>
      </div>
    </section>
    <section class="px-6">
      <input
        class="mb-5"
        multiple
        type="file"
        accept="image/png, image/jpeg, image/webp"
        @change="selectImages"
      />
      <!-- <p class="help is-danger" v-if="!$v.images.required">ใส่รูปด้วยจ้า</p> -->

      <div v-if="images" class="columns is-multiline">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="column is-one-quarter"
        >
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="showSelectImage(image)" alt="Placeholder image" />
              </figure>
            </div>
            <footer class="card-footer">
              <a
                @click="deleteSelectImage(index)"
                class="card-footer-item has-text-danger"
                >Delete</a
              >
            </footer>
          </div>
        </div>
      </div>

      <!-- title -->
      <div class="field mt-5">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model="$v.titleBlog.$model"
            :class="{ 'is-danger': $v.titleBlog.$error }"
            class="input"
            type="text"
            placeholder="Text input"
          />
        </div>
        <template v-if="$v.titleBlog.$error">
          <p class="help is-danger" v-if="!$v.titleBlog.required">
            This field is required
          </p>
          <p class="help is-danger" v-if="!$v.titleBlog.validationsTitle">
            ห้ามเลข
          </p>
          <p
            class="help is-danger"
            v-if="!$v.titleBlog.minLength || !$v.titleBlog.maxLength"
          >
            10-25 ตัว
          </p>
          <p
            class="help is-danger"
            v-if="!$v.titleBlog.between"
          >
            between
          </p>
        </template>
      </div>

      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea
            v-model="$v.jim.$model"
            :class="{ 'is-danger': $v.jim.$error }"
            class="textarea"
            placeholder="Textarea"
          ></textarea>
        </div>

        <template v-if="$v.jim.$error">
          <p class="help is-danger" v-if="!$v.jim.required">
            This field is required
          </p>
          <p class="help is-danger" v-if="!$v.jim.minLength">50 ตัวขึ้น</p>
        </template>
      </div>

      <div class="field">
        <label class="label">Reference</label>
        <div class="control">
          <input
            v-model="$v.reference.$model"
            :class="{ 'is-danger': $v.reference.$error }"
            class="input"
            type="url"
            placeholder="e.g. https://www.google.com"
          />
        </div>
        <template v-if="$v.reference.$error">
          <p class="help is-danger" v-if="!$v.reference.required">
            This field is required
          </p>
          <p class="help is-danger" v-if="!$v.reference.url">url only</p>
        </template>
      </div>

      <div class="control mb-3">
        <label class="radio">
          <input
            v-model="$v.statusBlog.$model"
            :class="{ 'is-danger': $v.statusBlog.$error }"
            type="radio"
            name="answer"
            value="status_private"
          />
          Private
        </label>
        <label class="radio">
          <input
            v-model="$v.statusBlog.$model"
            :class="{ 'is-danger': $v.statusBlog.$error }"
            type="radio"
            name="answer"
            value="status_public"
          />
          Public
        </label>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input v-model="pinnedBlog" type="checkbox" />
            Pinned
          </label>
        </div>
      </div>

      <hr />

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">วันที่โพสต์</label>
            <div class="control">
              <input
                v-model="$v.start_date.$model"
                :class="{ 'is-danger': $v.start_date.$error }"
                class="input"
                type="date"
              />
            </div>
          </div>
          <template v-if="$v.start_date.$error">
            <!-- <p class="help is-danger" v-if="!$v.end_date.required">
            This field is required
          </p> -->
            <p class="help is-danger" v-if="!$v.start_date.checkStart">
              ต้อใส่จบด้วย
            </p>
          </template>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">วันสิ้นสุดโพสต์</label>
            <div class="control">
              <input
                v-model="$v.end_date.$model"
                :class="{ 'is-danger': $v.end_date.$error }"
                class="input"
                type="date"
              />
            </div>
          </div>
        </div>
        <template v-if="$v.end_date.$error">
          <!-- <p class="help is-danger" v-if="!$v.end_date.required">
            This field is required
          </p> -->
          <p class="help is-danger" v-if="!$v.end_date.reqStart">
            ต้องใส่เริ่มด้วย
          </p>
          <p class="help is-danger" v-if="!$v.end_date.checkEnd">
            ต้องมากกว่าเริ่ม
          </p>
        </template>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button @click="submitBlog" class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button @click="$router.go(-1)" class="button is-link is-light">
            Cancel
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { required, minLength, maxLength, url, between } from "vuelidate/lib/validators";

function validationsTitle(value) {
  if (value.match(/[0-9]/)) {
    return false;
  }
  return true;
}
function checkStart() {
  return this.end_date;
}
function checkEnd(value) {
  // if (!this.start_date) {
  //   new Date(value) >= new Date(this.start_date)
  //   return new Date(value)
  // }
  // ถ้าค่าไม่มีค่าอะไร = t หรือไม่มีวันเริ่มมาก่อน = t หรือ วันรับมามากกว่าวันาเริ่ม = t
  return (
    !value || !this.start_date || new Date(value) >= new Date(this.start_date)
  );
}
export default {
  data() {
    return {
      blog: {},
      error: null,
      images: [], // array of image
      titleBlog: "",
      jim: "",
      pinnedBlog: false,
      statusBlog: "status_public",
      reference: "",
      start_date: "",
      end_date: "",
    };
  },
  validations: {
    titleBlog: {
      required: required,
      validationsTitle: validationsTitle,
      minLength: minLength(10),
      maxLength: maxLength(25),
      between: between(10, 25)
    },
    jim: {
      required: required,
      minLength: minLength(50),
    },
    statusBlog: {
      required: required,
    },
    reference: {
      required: required,
      url: url,
    },
    start_date: {
      check: checkStart,
    },
    end_date: {
      check: checkEnd,
      reqStart: function reqStart() {
        return this.start_date;
      },
    },
  },
  methods: {
    selectImages(event) {
      this.images = event.target.files;

      this.images.forEach((image, index) => {
        if (image.size > 1000000) {
          // aleart("file too large")
          alert("file too large")
          // this.images = Array.form(this.images);
          this.images.splice(index, 1)
        }
      })

    },
    showSelectImage(image) {
      // for preview only
      return URL.createObjectURL(image);
    },
    deleteSelectImage(index) {
      console.log(this.images);
      this.images = Array.from(this.images);
      this.images.splice(index, 1);
    },
    submitBlog() {
      console.log("submit");
      let formData = new FormData();
      formData.append("title", this.titleBlog);
      formData.append("jim", this.jim);
      formData.append("pinned", this.pinnedBlog ? 1 : 0);
      this.reference ? formData.append("reference", this.reference) : false;
      this.start_date ? formData.append("start_date", this.start_date) : false;
      this.end_date ? formData.append("end_date", this.end_date) : false;
      formData.append("statusBlog", this.statusBlog);
      this.images.forEach((image) => {
        if (image.size > 1000000) {
          console.log('asdf;')
        }
        formData.append("myImage", image);
      });

      console.log(formData);

      // Note ***************
      // ตอนเรายิง Postmant จะใช้ fromData
      // ตอนยิงหลาย ๆ รูปพร้อมกันใน Postman จะเป็นแบบนี้

      // title   | "This is a title of blog"
      // comment | "comment in blog"
      // ...
      // myImage | [select file 1]
      // myImage | [select file 2]
      // myImage | [select file 3]

      // จะสังเกตุว่าใช้ myImage เป็น key เดียวกัน เลยต้องเอามา loop forEach
      // พอไปฝั่ง backend มันจะจัด file ให้เป็น Array เพื่อเอาไปใช้งานต่อได้
      console.log("front axios");
      axios
        .post("http://localhost:3000/blogs", formData)
        .then((res) => this.$router.push({ name: "home" }))
        .catch((e) => console.log(e.response.data));
    },
  },
};
</script>

<style>
</style>