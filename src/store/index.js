import { create } from 'zustand';
import {
  fetchTimeline, fetchInterests, fetchProjects, fetchIdeas, fetchReviews,
  createIdea, updateIdeaStatus, createProject, updateProjectStatus,
} from '../api/notion';

export const useStore = create((set, get) => ({
  // connection
  connected: true,

  // route
  route: 'dashboard',
  setRoute: (r) => set({ route: r }),

  // data
  timeline:  [],
  interests: [],
  projects:  [],
  ideas:     [],
  reviews:   [],

  // loading states
  loading: { timeline: false, interests: false, projects: false, ideas: false, reviews: false },
  errors:  { timeline: null,  interests: null,  projects: null,  ideas: null,  reviews: null  },

  // fetch actions
  fetchAll: async () => {
    const s = get();
    await Promise.allSettled([
      s.fetchTimeline(),
      s.fetchInterests(),
      s.fetchProjects(),
      s.fetchIdeas(),
      s.fetchReviews(),
    ]);
  },

  fetchTimeline: async () => {
    set(s => ({ loading: { ...s.loading, timeline: true }, errors: { ...s.errors, timeline: null } }));
    try {
      const data = await fetchTimeline();
      set(s => ({ timeline: data, loading: { ...s.loading, timeline: false } }));
    } catch (e) {
      set(s => ({ loading: { ...s.loading, timeline: false }, errors: { ...s.errors, timeline: e.message } }));
    }
  },

  fetchInterests: async () => {
    set(s => ({ loading: { ...s.loading, interests: true } }));
    try {
      const data = await fetchInterests();
      set(s => ({ interests: data, loading: { ...s.loading, interests: false } }));
    } catch (e) {
      set(s => ({ loading: { ...s.loading, interests: false }, errors: { ...s.errors, interests: e.message } }));
    }
  },

  fetchProjects: async () => {
    set(s => ({ loading: { ...s.loading, projects: true } }));
    try {
      const data = await fetchProjects();
      set(s => ({ projects: data, loading: { ...s.loading, projects: false } }));
    } catch (e) {
      set(s => ({ loading: { ...s.loading, projects: false }, errors: { ...s.errors, projects: e.message } }));
    }
  },

  fetchIdeas: async () => {
    set(s => ({ loading: { ...s.loading, ideas: true } }));
    try {
      const data = await fetchIdeas();
      set(s => ({ ideas: data, loading: { ...s.loading, ideas: false } }));
    } catch (e) {
      set(s => ({ loading: { ...s.loading, ideas: false }, errors: { ...s.errors, ideas: e.message } }));
    }
  },

  fetchReviews: async () => {
    set(s => ({ loading: { ...s.loading, reviews: true } }));
    try {
      const data = await fetchReviews();
      set(s => ({ reviews: data, loading: { ...s.loading, reviews: false } }));
    } catch (e) {
      set(s => ({ loading: { ...s.loading, reviews: false }, errors: { ...s.errors, reviews: e.message } }));
    }
  },

  // filters
  timelinePeriod: '전체 기간',
  setTimelinePeriod: (p) => set({ timelinePeriod: p }),
  timelineCategory: '전체',
  setTimelineCategory: (c) => set({ timelineCategory: c }),

  reviewType: '전체',
  setReviewType: (t) => set({ reviewType: t }),

  interestView: '그래프',
  setInterestView: (v) => set({ interestView: v }),

  selectedInterest: null,
  setSelectedInterest: (id) => set({ selectedInterest: id }),

  // modals
  modal: null,
  setModal: (m) => set({ modal: m }),

  // mutations
  addIdea: async (idea) => {
    await createIdea(idea);
    await get().fetchIdeas();
  },

  moveIdea: async (id, status) => {
    await updateIdeaStatus(id, status);
    set(s => ({ ideas: s.ideas.map(i => i.id === id ? { ...i, status } : i) }));
  },

  addProject: async (proj) => {
    await createProject(proj);
    await get().fetchProjects();
  },

  moveProject: async (id, status) => {
    await updateProjectStatus(id, status);
    set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, status } : p) }));
  },

  // draft state for modals
  ideaDraft: { title: '', category: '관심사', memo: '' },
  setIdeaDraft: (d) => set(s => ({ ideaDraft: { ...s.ideaDraft, ...d } })),

  projectDraft: { name: '', status: '아이디어', stack: [], category: '개인', prdUrl: '', _stackInput: '' },
  setProjectDraft: (d) => set(s => ({ projectDraft: { ...s.projectDraft, ...d } })),
}));
