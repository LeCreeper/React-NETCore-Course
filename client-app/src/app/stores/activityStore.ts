import { makeAutoObservable, runInAction } from 'mobx';
import { Activity } from '../models/activity';
import agent from '../api/agent';
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
   activityRegistry = new Map<string, Activity>();
   selectedActivity: Activity | undefined = undefined;
   editMode = false;
   loading = false;
   loadingInitial = false;

   constructor() {
      makeAutoObservable(this);
   }

   get activitiesByDate() {
      return Array.from(this.activityRegistry.values()).sort(
         (a, b) => Date.parse(a.date) - Date.parse(b.date)
      );
   }

   loadActivities = async () => {
      this.setLoadingInitial(true);
      try {
         const activities = await agent.activities.list();
         activities.forEach((activity) => {
            this.setActivity(activity);
         });
         this.setLoadingInitial(false);
      } catch (error) {
         console.log(error);
         this.setLoadingInitial(false);
      }
   };

   loadActivity = async (id: string) => {
      let activity = this.getActivity(id);
      if (activity) {
         this.selectedActivity = activity;
         return activity;
      } else {
         this.setLoadingInitial(true);
         try {
            activity = await agent.activities.details(id);
            this.setActivity(activity);
            this.setSelectedActivity(activity);
            this.setLoadingInitial(false);
            return activity;
         } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
         }
      }
   };

   private getActivity = (id: string) => {
      return this.activityRegistry.get(id);
   };

   private setActivity = (activity: Activity) => {
      activity.date = activity.date.split('T')[0];
      this.setActivityRegistry(activity.id, activity);
   };

   setSelectedActivity = (activity: Activity) => {
      this.selectedActivity = activity;
   };

   setLoadingInitial = (state: boolean) => {
      this.loadingInitial = state;
   };

   setActivityRegistry = (id: string, activity: Activity) => {
      this.activityRegistry.set(id, activity);
   };

   createActivity = async (activity: Activity) => {
      this.loading = true;
      activity.id = uuid();
      try {
         await agent.activities.create(activity);
         runInAction(() => {
            this.setActivityRegistry(activity.id, activity);
            this.setSelectedActivity(activity);
            this.editMode = false;
            this.loading = false;
         });
      } catch (error) {
         console.log(error);
         runInAction(() => {
            this.loading = false;
         });
      }
   };

   updateActivity = async (activity: Activity) => {
      this.loading = true;
      try {
         await agent.activities.update(activity);
         runInAction(() => {
            this.setActivityRegistry(activity.id, activity);
            this.setSelectedActivity(activity);
            this.editMode = false;
            this.loading = false;
         });
      } catch (error) {
         console.log(error);
         runInAction(() => {
            this.loading = false;
         });
      }
   };

   deleteActivity = async (id: string) => {
      this.loading = true;
      try {
         await agent.activities.delete(id);
         runInAction(() => {
            this.activityRegistry.delete(id);
            this.loading = false;
         });
      } catch (error) {
         console.log(error);
         runInAction(() => {
            this.loading = false;
         });
      }
   };
}
