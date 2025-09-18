export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          content: string;
          word_count: number;
          sort_order: number;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          content: string;
          word_count: number;
          sort_order: number;
          user_id: string;
        };
        Update: {
          name?: string;
          content?: string;
          word_count?: number;
          sort_order?: number;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          user_id: string;
          created_at: string;
          updated_at: string;
          pet_type: string | null;
          pet_type_other: string | null;
          name: string | null;
          breed: string | null;
          sex: string | null;
          dob: string | null;
          gotcha_date: string | null;
          appearance: string | null;
          personality: string | null;
          favorite_things: string | null;
          relationship_to_owner: string | null;
          significant_memories: string | null;
          hopes_and_aspirations: string | null;
        };
        Insert: {
          user_id: string;
          created_at?: string;
          updated_at?: string;
          pet_type?: string | null;
          pet_type_other?: string | null;
          name?: string | null;
          breed?: string | null;
          sex?: string | null;
          dob?: string | null;
          gotcha_date?: string | null;
          appearance?: string | null;
          personality?: string | null;
          favorite_things?: string | null;
          relationship_to_owner?: string | null;
          significant_memories?: string | null;
          hopes_and_aspirations?: string | null;
        };
        Update: {
          updated_at?: string;
          pet_type?: string | null;
          pet_type_other?: string | null;
          name?: string | null;
          breed?: string | null;
          sex?: string | null;
          dob?: string | null;
          gotcha_date?: string | null;
          appearance?: string | null;
          personality?: string | null;
          favorite_things?: string | null;
          relationship_to_owner?: string | null;
          significant_memories?: string | null;
          hopes_and_aspirations?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id: string;
          name: string | null;
        };
        Update: {
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};


export type Chapter = Database['public']['Tables']['chapters']['Row'];

export interface MilestoneData {
  pet_type: string;
  pet_type_other: string;
  name: string;
  breed: string;
  sex: 'male' | 'female' | '';
  dob: string;
  gotcha_date: string;
  appearance: string;
  personality: string;
  favorite_things: string;
  relationship_to_owner: string;
  significant_memories: string;
  hopes_and_aspirations: string;
}

export type CockpitView = 'milestones' | 'chapters' | 'pictures' | 'settings' | 'menu' | 'auth' | 'mobile-menu' | 'pet-portrait-builder' | 'share-tale' | null;

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export type Theme = 'light' | 'dark';