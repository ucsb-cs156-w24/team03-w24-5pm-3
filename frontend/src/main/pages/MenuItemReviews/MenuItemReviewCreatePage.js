import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

const objectToAxiosParams = (menuItemReview) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
        itemId: menuItemReview.itemId,
        reviewerEmail: menuItemReview.reviewerEmail,
        stars: menuItemReview.stars,
        dateReviewed: menuItemReview.dateReviewed,
        comments: menuItemReview.comments
    }
    });

  const onSuccess = (menuItemReview) => {
    toast(`New review Created - id: ${menuItemReview.id} itemId: ${menuItemReview.itemId} stars: ${menuItemReview.stars}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/menuitemreviews/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />
  }

    // Stryker disable all : placeholder for future implementation
    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Create New MenuItemReview</h1>
            <MenuItemReviewForm submitAction={onSubmit} />
        </div>
        </BasicLayout>
    )
    }
