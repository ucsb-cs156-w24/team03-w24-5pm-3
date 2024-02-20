import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function RestaurantForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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

    const testIdPrefix = "UCSBDiningCommonMenuItemForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="diningCommonsCode">Dining Commons Code</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-diningCommonsCode"}
                    id="diningCommonsCode"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("diningCommonsCode", {
                        required: "DiningCommonsCode is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("name", {
                        required: "Name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="station">Station</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-station"}
                    id="station"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("station", {
                        required: "Station is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RestaurantForm;