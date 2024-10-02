<template>
    <div>
        <div class="background-animation">
        <div class="watermelon-grid"></div>
        </div>
    
        <div class="container">
        <header>
            <h1>My Projects</h1>
        </header>
    
        <section class="projects">
            <h2>Project List</h2>
            <ProjectBox
            v-for="project in projects"
            :key="project.title"
            :title="project.title"
            :description="project.description"
            :link="project.link"
            @click="handleProjectClick(project.link)"
            />
        </section>
    
        <section class="projects">
            <h2>Misc site Links</h2>
            <ProjectBox
            v-for="link in miscLinks"
            :key="link.title"
            :title="link.title"
            :description="link.description"
            :link="link.link"
            @click="handleProjectClick(link.link)"
            />
        </section>
    
        <section class="projects">
            <h2>Misc Subdomain Links</h2>
            <ProjectBox
            v-for="subLink in subdomainLinks"
            :key="subLink.title"
            :title="subLink.title"
            :description="subLink.description"
            :link="subLink.link"
            @click="handleProjectClick(subLink.link)"
            />
        </section>
    
        <section class="projects">
            <h2>All projects</h2>
            <ProjectBox
            v-for="allProject in allProjects"
            :key="allProject.title"
            :title="allProject.title"
            :description="allProject.description"
            :link="allProject.link"
            @click="handleProjectClick(allProject.link)"
            />
        </section>
    
        <footer>
            <p>Designed by Melon | &copy; 2024</p>
        </footer>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import ProjectBox from '../components/ProjectBox.vue';
  
  export default defineComponent({
    name: 'Projects',
    components: { ProjectBox },
    data() {
      return {
        projects: [
          { title: 'Azurite', description: 'Modding site similar to Thunderstore!', link: 'https://github.com/AbstractMelon/Azurite' },
          { title: 'SynkChat', description: 'JavaScript chat application.', link: 'https://github.com/AbstractMelon/SynkChat' },
          { title: 'SyntaxiaIDE', description: 'The IDE for Weblift!', link: 'https://github.com/AbstractMelon/SyntaxiaIDE' },
          { title: 'AstraSim', description: 'A space bridge simulator written in TypeScript!', link: 'https://github.com/AbstractMelon/AstraSim' },
          { title: 'Main Site', description: 'Go back to my main page!', link: 'https://abstractmelon.net' },
        ],
        miscLinks: [
          { title: 'Bagel', description: 'Misc game site!', link: 'https://abstractmelon.net/bagel' },
          { title: 'EdTalk', description: 'Ted Talk but its ed talking! (Not finished)', link: 'https://abstractmelon.net/edtalk' },
          { title: 'Bopl Map List', description: 'A list of all bopl battle maps!', link: 'https://abstractmelon.net/boplmaplist' },
          { title: 'Best Site Fr Fr no Cap', description: 'A site to let you open as many tabs as you want!', link: 'https://abstractmelon.net/bestsitefrfrnocap' },
          { title: 'Main Site', description: 'Go back to my main page!', link: 'https://abstractmelon.net' },
        ],
        subdomainLinks: [
          { title: 'Azurite', description: 'Modding site similar to Thunderstore!', link: 'https://github.com/AbstractMelon/Azurite' },
          { title: 'EdTalk', description: 'Ted Talk but its ed talking! (Not finished)', link: 'https://abstractmelon.net/edtalk' },
          { title: 'Bopl Map List', description: 'A list of all bopl battle maps!', link: 'https://abstractmelon.net/boplmaplist' },
          { title: 'Best Site Fr Fr no Cap', description: 'A site to let you open as many tabs as you want!', link: 'https://abstractmelon.net/bestsitefrfrnocap' },
          { title: 'Main Site', description: 'Go back to my main page!', link: 'https://abstractmelon.net' },
        ],
        allProjects: [
          { title: 'Git-Good', description: 'GitHub clone (Hosted on github lmao)', link: 'https://github.com/AbstractMelon/Git-Good' },
          { title: 'Azurite', description: 'Modding site similar to Thunderstore!', link: 'https://github.com/AbstractMelon/Azurite' },
          { title: 'BoplMapDatabase', description: 'Mapping database for Bopl Battle', link: 'https://github.com/AbstractMelon/BoplMapDatabase' },
          { title: 'MyWebsite', description: 'My personal website!', link: 'https://github.com/AbstractMelon/MyWebsite' },
          { title: 'Testing', description: 'asdf', link: 'https://github.com/AbstractMelon/Testing' },
          { title: 'Unity-Map-Maker-Project', description: 'A project to make Unity maps.', link: 'https://github.com/AbstractMelon/Unity-Map-Maker-Project' },
          { title: 'Obfuscate-And-Conquer', description: 'A tournament project for obfuscation and deobfuscation.', link: 'https://github.com/AbstractMelon/Obfuscate-And-Conquer' },
          { title: 'Qubi-Server', description: 'Server-side implementation for Qubi.', link: 'https://github.com/AbstractMelon/Qubi-Server' },
        ],
      };
    },
    methods: {
      handleProjectClick(link: string) {
        window.open(link, '_blank');
      },
    },
  });
  </script>
  

  <style>
    @import '../styles/styles.css';
  </style>
  
  