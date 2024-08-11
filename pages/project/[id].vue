<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useProjectsStore } from "@/stores/portfolio/projects/projects";
import ProjectTabs from "~/components/tabs/ProjectTabs.vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";

export interface ProjectStatus {
  id: number;
  name: string;
  color: string;
  is_default: boolean;
}

export interface ProjectType {
  id: number;
  name: string;
  is_default: boolean;
}

export interface Location {
  id: number;
  country: string;
  city: string;
  street: string;
}

export interface Manager {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  citizen_id: string;
}

export interface Project {
  id: number;
  project_status: ProjectStatus;
  project_type: ProjectType;
  location: Location;
  attached_files: any[];
  manager: Manager;
  employees: any[];
  teams: any[];
  material_resources: any[];
  workmanship_resources: any[];
  project_name: string;
  start_date: string;
  end_date: string;
  description: string;
  comment: string;
  current_stage: string;
}
const route = useRoute();
const store = useProjectsStore();
const project = ref<Project | null>(null);
const currentProjectId = ref<number | undefined>(0);

const getCurrentProjectId = () => { // забираем айди статуса текущего проекта, для отображения правильного активного статусБара
  currentProjectId.value = project.value?.project_status.id;
};

onMounted(async () => {
  const projectId = parseInt(route.params.id as string, 10);
  project.value = await store.getProjectById(projectId);
  getCurrentProjectId();
});
</script>

<template>
  <v-card variant="outlined">
    <BaseBreadcrumb :projectTitle="project?.project_name" />
    <ProjectTabs :project="project" :currentProjectId="currentProjectId" />
  </v-card>
</template>
