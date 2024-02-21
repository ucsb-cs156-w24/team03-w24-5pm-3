import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from 'main/components/MenuItemReviews/MenuItemReviewForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: menuItemReview, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/menuitemreviews?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/menuitemreviews`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (menuItemReview) => ({
        url: "/api/menuitemreviews",
        method: "PUT",
        params: {
            id: menuItemReview.id,
        },
        data: {
            itemId: menuItemReview.itemId,
            reviewerEmail: menuItemReview.reviewerEmail,
            stars: menuItemReview.stars,
            dateReviewed: menuItemReview.dateReviewed,
            comments: menuItemReview.comments
        }
    });

    const onSuccess = (menuItemReview) => {
        toast(`MenuItemReview Updated - id: ${menuItemReview.id} itemId: ${menuItemReview.itemId} stars: ${menuItemReview.stars}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/menuitemreviews?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/menuitemreviews" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit MenuItemReview</h1>
                {
                    menuItemReview && <MenuItemReviewForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={menuItemReview} />
                }
            </div>
        </BasicLayout>
    )

  
}
