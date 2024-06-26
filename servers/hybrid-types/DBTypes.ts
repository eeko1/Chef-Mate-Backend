type UserLevel = {
  level_id: number;
  level_name: 'Admin' | 'User' | 'Guest';
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  profile_picture_filename?: string; // Optional profile picture filename
  profile_picture_filesize?: number; // Optional profile picture filesize
  profile_picture_media_type?: string; // Optional profile picture media type
  profile_picture_url?: string; // Optional profile picture URL
  created_at: Date | string;
};

type UserFollow =  {
  userfollow_id: number,
  follower_id: number,
  followed_id : number,
  created_at: Date | string 
}

type MediaItem = {
  media_id: number;
  user_id: number;
  filename: string;
  thumbnail: string;
  filesize: number;
  media_type: string;
  title: string;
  ingredients: string | null;
  description: string | null;
  created_at: Date | string;
  app_id: string;
  likes?: Like[];
};

type Comment = {
  comment_id: number;
  media_id: number;
  user_id: number;
  comment_text: string;
  created_at: Date;
};

type Like = {
  like_id: number;
  media_id: number;
  user_id: number;
  created_at: Date;
};

type Rating = {
  rating_id: number;
  media_id: number;
  user_id: number;
  rating_value: number;
  created_at: Date;
};

type Tag = {
  tag_id: number;
  tag_name: string;
};

type MediaItemTag = {
  media_id: number;
  tag_id: number;
};

type TagResult = MediaItemTag & Tag;

type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

type MostLikedMedia = Pick<
  MediaItem,
  | 'media_id'
  | 'filename'
  | 'filesize'
  | 'media_type'
  | 'title'
  | 'description'
  | 'created_at'
> &
  Pick<User, 'user_id' | 'username' | 'email' | 'created_at'> & {
    likes_count: bigint;
  };

// type gymnastics to get rid of user_level_id from User type and replace it with level_name from UserLevel type
type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

type MediaItemWithOwner = MediaItem & Pick<User, 'username'>;

type UserIdWithFollow = User & Pick<UserFollow, 'follower_id' | 'followed_id'>;

// for upload server
type FileInfo = {
  filename: string;
  user_id: number;
};

export type {
  UserLevel,
  User,
  UserFollow,
  MediaItem,
  Comment,
  Like,
  Rating,
  Tag,
  MediaItemTag,
  TagResult,
  UploadResult,
  MostLikedMedia,
  UserWithLevel,
  UserWithNoPassword,
  TokenContent,
  MediaItemWithOwner,
  UserIdWithFollow,
  FileInfo,
};
