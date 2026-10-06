import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export interface PostStatusView {
  displayInfoMessage: (message: string) => void;
}

export class PostStatusPresenter {
  private statusService: StatusService;
  private view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.statusService = new StatusService();
    this.view = view;
  }
  public async submitPost() {
    var postingStatusToastId = "";

    try {
      postingStatusToastId = displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      setPost("");
      displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      deleteMessage(postingStatusToastId);
      setIsLoading(false);
    }
  }
}
