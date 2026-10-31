# Social scene choice cleanup

Removed the extra three-button mini-scene action row from `rikiSocialScene()` so Social Detective, Friendship Mystery, Teamwork Challenge, Emotion Lab and standard Social Skills questions present only their actual activity controls. The scene's optional `Watch the scene` button still provides an animation preview. No localStorage keys or game reward logic changed.

Known limitation: this fixes duplicate controls, not the quality of every character action. The 18 Social Detective outcomes and animation quality still require a separate full interaction test. The scene animation itself is not a substitute for testing the response choices.
