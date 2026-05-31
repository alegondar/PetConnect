export interface Profile {
  id: string
  user_id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  email?: string | null
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  owner_id: string
  name: string
  species: string
  breed: string | null
  age: number | null
  weight: number | null
  photo_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  author_id: string
  pet_id: string
  content: string | null
  photo_url: string | null
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  author?: Profile
  pet?: Pet
}

export interface PostDetail extends Post {
  liked_by_me: boolean
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string
  author?: Profile
}

export interface VetVisit {
  id: string
  pet_id: string
  vet_name: string
  visit_date: string
  reason: string
  notes: string | null
}

export interface PetEvent {
  id: string
  pet_id: string
  event_type: string
  event_date: string
  value: string | null
  notes: string | null
}

export interface RankingEntry {
  rank: number
  pet_id: string
  pet_name: string
  pet_photo_url: string | null
  owner_username: string
  likes_this_week: number
}

export interface LostPet {
  id: string
  reporter_id: string
  name: string
  species: string
  breed: string | null
  photo_url: string | null
  last_seen_lat: number
  last_seen_lng: number
  last_seen_address: string | null
  description: string | null
  status: string
  created_at: string
  reporter?: Profile
}

export interface Adoption {
  id: string
  pet_id: string
  owner_id: string
  adopter_id: string | null
  status: string
  description: string | null
  created_at: string
  pet?: Pet
  owner?: Profile
}

export interface InstaPetPost {
  id: string
  pet_id: string
  author_id: string
  photo_url: string | null
  video_url: string | null
  description: string | null
  likes_count: number
  comments_count: number
  created_at: string
  author?: Profile
}

export interface InstaPetMilestone {
  id: string
  pet_id: string
  title: string
  description: string | null
  photo_url: string | null
  milestone_date: string
  created_at: string
}

export interface Follower {
  id: string
  follower_id: string
  pet_id: string
  created_at: string
  follower?: Profile
}

export interface FollowingPet {
  pet_id: string
  pet_name: string
  pet_photo_url: string | null
  species: string
  followed_at: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}
