import moxios from 'moxios';
import ApprovalAPI from '../approvalsAPI';

const baseUrl = 'http://127.0.0.1:5000/api/v1';

describe('ApprovalAPI', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should send a Get request to retrieve approvals', async () => {
    const url = '?status=open';

    moxios.stubRequest(`${baseUrl}/approvals${url}`, {
      status: 200,
      response: {
        data: {name: 'Smith Nella'}
      }
    });

    const response = await ApprovalAPI.getUserApprovals(url);
    const request = moxios.requests.mostRecent();
    expect(request.url).toEqual(`${baseUrl}/approvals${url}`);
    expect(request.config.method).toEqual('get');
    expect(response.data).toEqual({
      data: {
        name: 'Smith Nella'
      }
    });
  });
  it('should send a PUT request to update a travel request status', async () => {
    const statusUpdateData = {
      requestId: 1,
      status: 'Approved'
    };

    moxios.stubRequest(`${baseUrl}/approvals/1`, {
      status: 200,
      response: {
        status: 'Approved'
      }
    });

    const response = await ApprovalAPI.updateRequestStatus(statusUpdateData);
    const request = moxios.requests.mostRecent();
    expect(request.url).toEqual(`${baseUrl}/approvals/1`);
    expect(request.config.method).toEqual('put');
    expect(response.data).toEqual({
      status: 'Approved'
    });
  });
});
