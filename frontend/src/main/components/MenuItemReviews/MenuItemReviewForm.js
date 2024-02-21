import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            
            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="MenuItemReviewForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="itemId">Menu Item ID</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-itemId"
                    id="itemId"
                    type="number"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("itemId", {
                        required: "Menu Item ID is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.itemId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="reviewerEmail">Email</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-reviewerEmail"
                    id="reviewerEmail"
                    type="text"
                    isInvalid={Boolean(errors.reviewerEmail)}
                    {...register("reviewerEmail", {
                        required: "Email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="stars">Stars</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-stars"
                    id="stars"
                    type="number"
                    isInvalid={Boolean(errors.stars)}
                    {...register("stars", {
                        required: "Stars are required.",
                        min: 0,
                        max: 5
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.stars?.message}
                    {(errors.stars?.type === 'min') && 'Minimum rating of 1 star'}
                    {(errors.stars?.type === 'max') && 'Maximum rating of 5 stars'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateReviewed">Date (iso format)</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-dateReviewed"
                    id="dateReviewed"
                    type="datetime-local"
                    isInvalid={Boolean(errors.dateReviewed)}
                    {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateReviewed && 'Date is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">Comments</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-comments"
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.comments)}
                    {...register("comments")}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comments?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid="MenuItemReviewForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="MenuItemReviewForm-cancel"
            >
                Cancel
            </Button>

        </Form>
    )
}

export default MenuItemReviewForm;