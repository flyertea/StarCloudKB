import { WorkflowType } from '@/enums/workflow'
import { t } from '@/locales'

export const startNode = {
  id: WorkflowType.Start,
  type: WorkflowType.Start,
  x: 180,
  y: 720,
  properties: {
    height: 200,
    stepName: t('startNode'),
    config: {
      fields: [
        {
          label: t('baseNode.nodeData.question'),
          value: 'question'
        }
      ],
      globalFields: [
        {
          value: 'time',
          label: t('baseNode.nodeData.time')
        }
      ]
    }
  }
}

export const baseNode = {
  id: WorkflowType.Base,
  type: WorkflowType.Base,
  x: 200,
  y: 270,
  properties: {
    height: 200,
    stepName: t('baseNode.stepName'),
    node_data: {
      name: '',
      desc: '',
      prologue: t('baseNode.nodeData.prologue')
    },
    config: {}
  }
}
/**
 * 说明
 * type 与 nodes 文件对应
 */
export const baseNodes = [baseNode, startNode]
/**
 * ai对话节点配置数据
 */
export const aiChatNode = {
  type: WorkflowType.AiChat,
  text: t('aiChatNode.text'),
  label: t('aiChatNode.label'),
  properties: {
    stepName: t('aiChatNode.stepName'),
    config: {
      fields: [
        {
          label: t('aiChatNode.fields.answer'),
          value: 'answer'
        }
      ]
    }
  }
}
/**
 * 知识库检索配置数据
 */
export const searchDatasetNode = {
  type: WorkflowType.SearchDataset,
  text: t('searchDatasetNode.text'),
  label: t('searchDatasetNode.label'),
  properties: {
    stepName: t('searchDatasetNode.stepName'),
    config: {
      fields: [
        { label: t('searchDatasetNode.fields.paragraphList'), value: 'paragraph_list' },
        { label: t('searchDatasetNode.fields.isHitHandlingMethodList'), value: 'is_hit_handling_method_list' },
        {
          label: t('searchDatasetNode.fields.data'),
          value: 'data'
        },
        {
          label: t('searchDatasetNode.fields.directlyReturn'),
          value: 'directly_return'
        }
      ]
    }
  }
}
export const questionNode = {
  type: WorkflowType.Question,
  text: t('questionNode.text'),
  label: t('questionNode.label'),
  properties: {
    stepName: t('questionNode.stepName'),
    config: {
      fields: [
        {
          label: t('questionNode.fields.answer'),
          value: 'answer'
        }
      ]
    }
  }
}
export const conditionNode = {
  type: WorkflowType.Condition,
  text: t('conditionNode.text'),
  label: t('conditionNode.label'),
  properties: {
    width: 600,
    stepName: t('conditionNode.stepName'),
    config: {
      fields: [
        {
          label: t('conditionNode.fields.branchName'),
          value: 'branch_name'
        }
      ]
    }
  }
}
export const replyNode = {
  type: WorkflowType.Reply,
  text: t('replyNode.text'),
  label: t('replyNode.label'),
  properties: {
    stepName: t('replyNode.stepName'),
    config: {
      fields: [
        {
          label: t('replyNode.fields.answer'),
          value: 'answer'
        }
      ]
    }
  }
}
export const menuNodes = [aiChatNode, searchDatasetNode, questionNode, conditionNode, replyNode]

export const compareList = [
  { value: 'is_null', label: t('compareList.is_null') },
  { value: 'is_not_null', label: t('compareList.is_not_null') },
  { value: 'contain', label: t('compareList.contain') },
  { value: 'not_contain', label: t('compareList.not_contain') },
  { value: 'eq', label: t('compareList.eq') },
  { value: 'ge', label: t('compareList.ge') },
  { value: 'gt', label: t('compareList.gt') },
  { value: 'le', label: t('compareList.le') },
  { value: 'len_eq', label: t('compareList.len_eq') },
  { value: 'len_ge', label: t('compareList.len_ge') },
  { value: 'len_gt', label: t('compareList.len_gt') },
  { value: 'len_le', label: t('compareList.len_le') },
  { value: 'len_lt', label: t('compareList.len_lt') },
  { value: 'lt', label: t('compareList.lt') }
]

export const nodeDict: any = {
  [WorkflowType.AiChat]: aiChatNode,
  [WorkflowType.SearchDataset]: searchDatasetNode,
  [WorkflowType.Question]: questionNode,
  [WorkflowType.Condition]: conditionNode,
  [WorkflowType.Base]: baseNode,
  [WorkflowType.Start]: startNode,
  [WorkflowType.Reply]: replyNode
}
export function isWorkFlow(type: string | undefined) {
  return type === 'WORK_FLOW'
}