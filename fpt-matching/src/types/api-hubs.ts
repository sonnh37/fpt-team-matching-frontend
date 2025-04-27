interface UserProfileHub {
  context?: string | null;
  abbreviation?: string | null;
  profession?: string | null;
  specialty?: string | null;
  fullname?: string | null;
  phone?: string | null;
  skill?: string[] | null;
  education_level?: string | null;
}


interface UserRecommendations{
  skillProfileId?: string  ,
  profile_student_id?: string  ,
  full_skill?: string   ,
  user_id ?: string  ,
  first_name ?: string  , 
  last_name ?: string  ,
  email ?: string  ,
  similarity?: number
}
