import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: helpRequest, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/helprequests?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/helprequests`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (helpRequest) => ({
    url: "/api/helprequests",
    method: "PUT",
    params: {
      id: helpRequest.id,
    },
    data: {
      requesterEmail: helpRequest.requesterEmail,
      teamId: helpRequest.teamId,
      tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
      requestTime: helpRequest.requestTime,
      explanation: helpRequest.explanation,
      solved: helpRequest.solved,
  }
  });

  const onSuccess = (helpRequest) => {
    toast(`Help Request Updated - id: ${helpRequest.id} requesterEmail: ${helpRequest.requesterEmail} teamId: ${helpRequest.teamId} tableOrBreakoutRoom: ${helpRequest.tableOrBreakoutRoom} requestTime: ${helpRequest.requestTime} explanation: ${helpRequest.explanation} solved: ${helpRequest.solved}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/helprequests?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequests" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Help Request</h1>
        {
          helpRequest && <HelpRequestForm initialContents={helpRequest} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
