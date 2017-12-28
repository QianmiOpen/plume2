import StrEnum from 'str-enum';

/**
 * 封装字符串的枚举类型
 * Usage:
 * actionType(
 *  'INIT',
 *  'LOADING_START'
 * )
 *
 * const Actions = actionType({
 *   PDF: 'application/pdf',
 *   Text: 'text/plain',
 *   JPEG: 'image/jpeg'
 * });
 */
export default StrEnum;
