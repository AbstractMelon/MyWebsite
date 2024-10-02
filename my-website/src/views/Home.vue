<template>
  <div class="container">
    <Header />
    <section>
      <h2>About Me</h2>
      <p>
        I'm Melon, and I'm passionate about coding and technology. I enjoy
        working on various projects and exploring new things!
      </p>
      <p>
        This webpage serves as a showcase of my interests, projects, and
        experience of technology.
      </p>
    </section>

    <section class="projects">
      <h2>Projects</h2>
      <ProjectBox
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :description="project.description"
        :link="project.link"
      />
    </section>

    <section>
      <h2>Contact Me</h2>
      <p>
        If you'd like to get in touch with me, feel free to reach out via email
        at
        <a href="mailto:abstractmelons@gmail.com">abstractmelons@gmail.com</a>.
      </p>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import ProjectBox from "../components/ProjectBox.vue";

export default {
  name: 'Home',
  components: { Header, Footer, ProjectBox },
  data() {
    return {
      projects: [
        {
          title: "Azurite",
          description: "Modding site similar to Thunderstore!",
          link: "https://github.com/AbstractMelon/Azurite",
        },
        {
          title: "SynkChat",
          description: "JavaScript chat application.",
          link: "https://github.com/AbstractMelon/SynkChat",
        },
        {
          title: "SyntaxiaIDE",
          description: "The IDE for Weblift!",
          link: "https://github.com/AbstractMelon/SyntaxiaIDE",
        },
        {
          title: "AstraSim",
          description: "A space bridge simulator written in TypeScript!",
          link: "https://github.com/AbstractMelon/AstraSim",
        },
        {
          title: "And many more!",
          description:
            "You can see a list of all of my projects by clicking this box!",
          link: "https://abstractmelon.net/projects",
        },
      ],
    };
  },
};
</script>

<style>
@import "../styles/styles.css";
</style>
