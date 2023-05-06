import PostModel from "../models/post.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось посты",
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(404).json({
        message: "Статьи с таким id не найдено",
      });
    }
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      ...req.body,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (result) {
      return res.json({
        message: "Статья удалена",
      });
    } else {
      return res.status(404).json({
        message: "Статьи с таким id не найдено",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        ...req.body,
      }
    );
    if (result) {
      return res.json({
        message: "Статья обновлена",
      });
    } else {
      return res.status(404).json({
        message: "Статьи с таким id не найдено",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось посты",
    });
  }
};
